import type { BuildAiRequest, GeneratedDocumentation, RepositorySnapshot } from "../types";
import { generateWithLLM, isLLMAvailable } from "./llmService";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateDocumentation(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
): Promise<GeneratedDocumentation> {
  if (isLLMAvailable(request.groqApiKey)) {
    return generateWithLLMPipeline(request, repository);
  }
  return buildLocalDocumentation(request, repository);
}

export async function reviseDocumentation(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  previous: GeneratedDocumentation,
  feedback: string,
): Promise<GeneratedDocumentation> {
  if (isLLMAvailable(request.groqApiKey)) {
    return reviseWithLLMPipeline(request, repository, previous, feedback);
  }

  const revised = buildLocalDocumentation(
    {
      ...request,
      instructions: [request.instructions, feedback].filter(Boolean).join("\n\nCreator revision feedback:\n"),
    },
    repository,
  );

  return {
    ...revised,
    summary: `${revised.summary} Revised with creator feedback: ${feedback.slice(0, 220)}`,
    creatorQuestions: unique([...revised.creatorQuestions, ...previous.creatorQuestions]),
  };
}

// ---------------------------------------------------------------------------
// LLM-powered generation
// ---------------------------------------------------------------------------

const README_SYSTEM_PROMPT = `You are a senior technical writer who produces world-class GitHub README files. You write documentation that is genuinely useful to developers — clear, specific, and technically precise.

Your writing style:
- Professional and direct. No filler, no fluff, no marketing speak.
- Use concrete details from the actual source code — real function names, real file paths, real configuration values.
- Explain WHY things work the way they do, not just WHAT exists.
- Write installation and usage instructions that a developer can follow without guessing.
- Include real code examples drawn from the actual repository source files.
- Structure content with clear hierarchy — overview first, then details.
- Use proper markdown formatting: headers, code blocks with language tags, tables where appropriate, badge images.

Rules:
- Output ONLY the raw markdown content. No wrapping code fences, no preamble, no closing remarks.
- Do NOT invent features, files, or dependencies that don't exist in the provided repository data.
- Do NOT use phrases like "detected from repository layout" or "sampled files" — write as if you deeply understand the project.
- Do NOT add emojis to headers or content.
- Keep the tone technical and human — as if a skilled engineer wrote this by hand.`;

async function generateWithLLMPipeline(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
): Promise<GeneratedDocumentation> {
  const analysis = analyzeRepository(repository);

  // Generate README with minimal context to stay under token limit
  const readmeContext = buildMinimalContext(request, repository, analysis);
  const readmePrompt = buildReadmePromptChunked(request, readmeContext);
  const readme = await generateWithLLM(requireGroqKey(request), README_SYSTEM_PROMPT, readmePrompt, 0.45);

  // Generate docs separately with their own focused context
  const docs = await generateDocsWithChunkedContext(request, repository, analysis);

  return {
    readme,
    docs,
    summary: `Generated README${docs.length ? ` and ${docs.length} doc(s)` : ""} using Groq LLM from ${repository.files.length} analyzed files in ${repository.owner}/${repository.repo}.`,
    creatorQuestions: buildCreatorQuestions(analysis, request),
  };
}

async function reviseWithLLMPipeline(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  previous: GeneratedDocumentation,
  feedback: string,
): Promise<GeneratedDocumentation> {
  const revisionSystemPrompt = `You are a senior technical writer revising a GitHub README based on the author's feedback. Apply the requested changes precisely while maintaining professional quality and technical accuracy.

Rules:
- Output ONLY the revised raw markdown content. No wrapping code fences, no preamble.
- Preserve sections the author didn't ask to change.
- Do NOT add emojis.
- Keep the same professional tone as the original.`;

  const revisionPrompt = `Here is the current README that needs revision:

---BEGIN CURRENT README---
${previous.readme}
---END CURRENT README---

The author's feedback and requested changes:
${feedback}

${request.instructions ? `Original author instructions that still apply:\n${request.instructions}` : ""}

Please revise the README according to the feedback above. Output only the complete revised markdown.`;

  const revisedReadme = await generateWithLLM(requireGroqKey(request), revisionSystemPrompt, revisionPrompt, 0.35);

  return {
    readme: revisedReadme,
    docs: previous.docs,
    summary: `Revised README with author feedback: "${feedback.slice(0, 200)}"`,
    creatorQuestions: previous.creatorQuestions,
  };
}

function buildLLMContext(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
): string {
  const sections: string[] = [];

  // Repository metadata
  sections.push(`## Repository: ${repository.owner}/${repository.repo}`);
  sections.push(`URL: ${repository.githubUrl}`);
  sections.push(`Total files in tree: ${repository.fileTree.length}`);
  sections.push(`Files analyzed in detail: ${repository.files.length}`);

  // Package info
  if (analysis.description) {
    sections.push(`\nPackage description: ${analysis.description}`);
  }

  // Tech stack
  const stack = repository.detectedStack.length ? repository.detectedStack : inferStackFromDeps(analysis);
  if (stack.length) {
    sections.push(`\n## Detected Tech Stack\n${stack.join(", ")}`);
  }

  // Production Dependencies only
  if (analysis.dependencies.length) {
    sections.push(`\n## Dependencies\n${analysis.dependencies.slice(0, 15).join(", ")}`);
  }

  // Key scripts only
  if (Object.keys(analysis.scripts).length) {
    sections.push(`\n## Scripts`);
    const keyScripts = Object.entries(analysis.scripts).slice(0, 6);
    for (const [name, command] of keyScripts) {
      sections.push(`- ${name}: ${command}`);
    }
  }

  // Commands (minimal)
  sections.push(`\n## Build Info`);
  sections.push(`Install: ${analysis.installCommand}`);
  if (analysis.runCommand) sections.push(`Run: ${analysis.runCommand}`);
  if (analysis.buildCommand) sections.push(`Build: ${analysis.buildCommand}`);

  // API routes only
  if (analysis.apiRoutes.length) {
    sections.push(`\n## API Routes\n${analysis.apiRoutes.join("\n")}`);
  }

  // File tree (condensed)
  const treeFiles = repository.fileTree.slice(0, 8);
  sections.push(`\n## File Tree\n${treeFiles.join("\n")}${repository.fileTree.length > 8 ? `\n...and ${repository.fileTree.length - 8} more files` : ""}`);

  // Actual source file contents — minimal
  sections.push(`\n## Source Files`);
  let contentBudget = 2000;
  for (const file of repository.files) {
    if (contentBudget <= 0) break;
    const truncatedContent = file.content.slice(0, Math.min(file.content.length, contentBudget));
    sections.push(`\n### File: ${file.path} (${file.language}, ${file.size} bytes)\n\`\`\`${file.language.toLowerCase()}\n${truncatedContent}\n\`\`\``);
    contentBudget -= truncatedContent.length;
  }

  return sections.join("\n");
}

function buildMinimalContext(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
): string {
  const sections: string[] = [];
  sections.push(`## Repository: ${repository.owner}/${repository.repo}`);
  
  if (analysis.description) {
    sections.push(`\nDescription: ${analysis.description}`);
  }

  const stack = repository.detectedStack.length ? repository.detectedStack : inferStackFromDeps(analysis);
  if (stack.length) {
    sections.push(`\n## Tech Stack\n${stack.join(", ")}`);
  }

  if (analysis.dependencies.length) {
    sections.push(`\n## Key Dependencies\n${analysis.dependencies.slice(0, 8).join(", ")}`);
  }

  sections.push(`\n## Build Info`);
  sections.push(`Install: ${analysis.installCommand}`);
  if (analysis.runCommand) sections.push(`Run: ${analysis.runCommand}`);
  if (analysis.buildCommand) sections.push(`Build: ${analysis.buildCommand}`);

  if (analysis.apiRoutes.length) {
    sections.push(`\n## API Routes\n${analysis.apiRoutes.join("\n")}`);
  }

  // Only top 3 source files with minimal content
  sections.push(`\n## Source Files (Sample)`);
  let budget = 1000;
  for (const file of repository.files.slice(0, 3)) {
    if (budget <= 0) break;
    const content = file.content.slice(0, Math.min(file.content.length, budget));
    sections.push(`\n### ${file.path}\n\`\`\`${file.language.toLowerCase()}\n${content}\n\`\`\``);
    budget -= content.length;
  }

  return sections.join("\n");
}

function buildReadmePromptChunked(request: BuildAiRequest, context: string): string {
  const parts: string[] = [];
  parts.push(`Generate ONLY the markdown content for a professional README.md file. Do not include code fences wrapping the entire document.\n`);

  if (request.projectName) {
    parts.push(`Project title: ${request.projectName}`);
  }

  if (request.instructions) {
    parts.push(`\nSpecial instructions:\n${request.instructions}`);
  }

  parts.push(`\nInclude sections for: Overview, Features, Tech Stack, Quick Start, and Usage. Keep it concise.\n`);
  parts.push(context);
  return parts.join("\n");
}

async function generateDocsWithChunkedContext(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
): Promise<GeneratedDocumentation["docs"]> {
  if (request.documentationDepth === "readme-only") {
    return [];
  }

  const title = request.projectName || analysis.name || repository.repo;
  const docs: GeneratedDocumentation["docs"] = [];

  // Architecture doc with minimal context
  const archContext = `# ${title} Architecture\n\nTech Stack: ${repository.detectedStack.join(", ")}\n\nKey files:\n${repository.files.slice(0, 5).map((f) => `- ${f.path}`).join("\n")}`;
  const architectureContent = await generateWithLLM(
    requireGroqKey(request),
    "You are a technical architect. Write concise architecture documentation in markdown. Output only markdown, no code fences.",
    `Generate Architecture documentation for ${title}.\n\n${archContext}`,
    0.5,
  );

  docs.push({
    path: "docs/architecture.md",
    title: "Architecture",
    content: architectureContent,
  });

  return docs;
}

// DEPRECATED: Use buildReadmePromptChunked instead for lower token usage
function buildReadmePrompt(request: BuildAiRequest, context: string): string {
  const parts: string[] = [];

  parts.push(`Generate a comprehensive, professional README.md for the following repository.\n`);

  if (request.projectName) {
    parts.push(`Project name to use in the title: ${request.projectName}`);
  }

  if (request.instructions) {
    parts.push(`\nAuthor's specific instructions:\n${request.instructions}`);
  }

  parts.push(`\nThe README should include (as appropriate based on what exists in the repo):`);
  parts.push(`1. A clean title with relevant shield.io badges`);
  parts.push(`2. A concise but informative project description explaining what this project does and why it's useful`);
  parts.push(`3. A features section with specific, genuine feature descriptions drawn from the actual code`);
  parts.push(`4. Tech stack listing`);
  parts.push(`5. Project structure overview (use a code block tree format, keep it to the important directories/files)`);
  parts.push(`6. Getting Started section with Prerequisites, Installation, and Running instructions — use the actual commands from the repo`);
  parts.push(`7. Configuration/Environment variables section if env vars exist`);
  parts.push(`8. API documentation if routes exist`);
  parts.push(`9. Usage examples with real code snippets from the repository`);
  parts.push(`10. Contributing guidelines`);
  parts.push(`11. License section`);
  parts.push(`\nQuality bar: produce a deep, production-grade README, not a short generated summary. Prefer concrete paragraphs, tables, implementation notes, architecture explanations, troubleshooting guidance, and examples grounded in the supplied files.`);
  parts.push(`Reference real files and modules where useful. Avoid vague language like "robust", "powerful", or "seamless" unless the code proves it.`);

  parts.push(`\nHere is the complete repository analysis data:\n`);
  parts.push(context);

  return parts.join("\n");
}

// DEPRECATED: Use generateDocsWithChunkedContext instead for lower token usage
async function generateDocsWithLLM(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
  context: string,
): Promise<GeneratedDocumentation["docs"]> {
  if (request.documentationDepth === "readme-only") {
    return [];
  }

  const title = request.projectName || analysis.name || repository.repo;

  const architecturePrompt = `Generate an Architecture documentation file (docs/architecture.md) for "${title}".

Based on the repository analysis below, write a clear technical architecture document covering:
- High-level system overview and how components connect
- Key modules and their responsibilities  
- Data flow and request lifecycle (if it's a web app/API)
- Important design patterns used in the code
- Directory structure rationale

Write it as a developer would for their team. Be specific — reference actual file paths and module names.

Repository data:
${context}`;

  const architectureContent = await generateWithLLM(
    requireGroqKey(request),
    "You are a senior software architect writing internal technical documentation. Output only raw markdown, no code fences wrapping the entire document. No emojis.",
    architecturePrompt,
    0.5,
  );

  const docs = [
    {
      path: "docs/architecture.md",
      title: "Architecture",
      content: architectureContent,
    },
  ];

  if (request.documentationDepth === "complete") {
    const devGuidePrompt = `Generate a Development Guide (docs/development.md) for "${title}".

Cover:
- Local development environment setup (step by step)
- All available npm/package scripts and what they do
- Code style and conventions used in the project
- Testing approach and how to run tests
- Common development workflows
- Debugging tips

Repository data:
${context}`;

    const devContent = await generateWithLLM(
      requireGroqKey(request),
      "You are a senior developer writing an onboarding guide for new team members. Output only raw markdown. No emojis.",
      devGuidePrompt,
      0.5,
    );

    const apiPrompt = `Generate an API Reference (docs/api.md) for "${title}".

Document all detected HTTP endpoints with:
- Method and path
- Purpose/description
- Request body format (inferred from source code)
- Response format
- Example curl commands or fetch calls

If no HTTP API exists, document the main exported functions/modules instead.

Repository data:
${context}`;

    const apiContent = await generateWithLLM(
      requireGroqKey(request),
      "You are a senior API documentation writer. Output only raw markdown. No emojis. Use tables for parameters where appropriate.",
      apiPrompt,
      0.5,
    );

    docs.push(
      { path: "docs/development.md", title: "Development Guide", content: devContent },
      { path: "docs/api.md", title: "API Reference", content: apiContent },
    );
  }

  return docs;
}

// ---------------------------------------------------------------------------
// Template-based fallback (original implementation)
// ---------------------------------------------------------------------------

function buildLocalDocumentation(request: BuildAiRequest, repository: RepositorySnapshot): GeneratedDocumentation {
  const analysis = analyzeRepository(repository);
  const title = request.projectName || analysis.name || repository.repo;
  const docs = buildTemplateDocs(request, repository, analysis, title);

  return {
    readme: buildTemplateReadme(request, repository, analysis, title),
    docs,
    summary: `Generated README${docs.length ? ` and ${docs.length} documentation file(s)` : ""} locally from ${repository.files.length} sampled files in ${repository.owner}/${repository.repo}. (Template mode — set GROQ_API_KEY for AI-powered generation.)`,
    creatorQuestions: buildCreatorQuestions(analysis, request),
  };
}

function requireGroqKey(request: BuildAiRequest) {
  if (!request.groqApiKey?.trim()) {
    throw new Error("Groq API key is required for AI-powered documentation generation.");
  }

  return request.groqApiKey;
}

// ---------------------------------------------------------------------------
// Repository analysis (shared by both LLM and template paths)
// ---------------------------------------------------------------------------

interface RepositoryAnalysis {
  name: string;
  description?: string;
  scripts: Record<string, string>;
  dependencies: string[];
  devDependencies: string[];
  envVars: string[];
  entrypoints: string[];
  apiRoutes: string[];
  components: string[];
  tests: string[];
  configFiles: string[];
  installCommand: string;
  runCommand?: string;
  buildCommand?: string;
  testCommand?: string;
  packageManager: "npm" | "pnpm" | "yarn" | "pip" | "cargo" | "go" | "unknown";
}

function analyzeRepository(repository: RepositorySnapshot): RepositoryAnalysis {
  const primaryManifest = repository.packageManifests[0] as
    | {
        name?: string;
        description?: string;
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      }
    | undefined;

  const fileSet = new Set(repository.fileTree);
  const scripts = primaryManifest?.scripts ?? {};
  const dependencies = Object.keys(primaryManifest?.dependencies ?? {});
  const devDependencies = Object.keys(primaryManifest?.devDependencies ?? {});
  const packageManager = detectPackageManager(repository.fileTree);

  return {
    name: primaryManifest?.name ?? repository.repo,
    description: primaryManifest?.description,
    scripts,
    dependencies,
    devDependencies,
    envVars: detectEnvVars(repository),
    entrypoints: detectEntrypoints(repository),
    apiRoutes: detectApiRoutes(repository),
    components: repository.fileTree.filter((file) => /(^|\/)components\/.+\.(tsx|jsx|vue|svelte)$/i.test(file)).slice(0, 30),
    tests: repository.fileTree.filter((file) => /\.(test|spec)\.(ts|tsx|js|jsx|py|go|rs)$/i.test(file)).slice(0, 30),
    configFiles: repository.fileTree.filter((file) => isConfigFile(file)).slice(0, 30),
    installCommand: buildInstallCommand(packageManager, fileSet),
    runCommand: chooseScriptCommand(scripts, packageManager, ["dev", "start", "serve"]),
    buildCommand: chooseScriptCommand(scripts, packageManager, ["build"]),
    testCommand: chooseScriptCommand(scripts, packageManager, ["test"]),
    packageManager,
  };
}

// ---------------------------------------------------------------------------
// Template-based README builder (fallback)
// ---------------------------------------------------------------------------

function buildTemplateReadme(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
  title: string,
) {
  const badges = buildBadges(repository, analysis);
  const stack = repository.detectedStack.length ? repository.detectedStack : inferStackFromDeps(analysis);
  const featureBullets = buildFeatureBullets(repository, analysis);
  const tree = formatTree(repository.fileTree);

  return [
    `<h1 align="center">${escapeMarkdown(title)}</h1>`,
    "",
    analysis.description ? `<p align="center">${escapeMarkdown(analysis.description)}</p>` : `<p align="center">A codebase documented with mdfmt's local repository documentation agent.</p>`,
    "",
    badges,
    "",
    "## Overview",
    "",
    `${escapeMarkdown(title)} is maintained in [${repository.owner}/${repository.repo}](${repository.githubUrl}). This README was generated from the repository structure, package manifests, source files, configuration files, and detected commands.`,
    "",
    request.instructions ? `Creator guidance considered while drafting this document: ${escapeMarkdown(request.instructions)}` : "",
    "",
    "## Features",
    "",
    featureBullets.map((item) => `- ${item}`).join("\n"),
    "",
    "## Tech Stack",
    "",
    stack.length ? stack.map((item) => `- ${item}`).join("\n") : "- Stack could not be confidently detected from sampled files.",
    "",
    "## Project Structure",
    "",
    "```text",
    tree,
    "```",
    "",
    "## Getting Started",
    "",
    "### Prerequisites",
    "",
    buildPrerequisites(analysis, stack).map((item) => `- ${item}`).join("\n"),
    "",
    "### Installation",
    "",
    "```bash",
    `git clone ${repository.githubUrl}.git`,
    `cd ${repository.repo}`,
    analysis.installCommand,
    "```",
    "",
    analysis.runCommand
      ? ["### Run Locally", "", "```bash", analysis.runCommand, "```"].join("\n")
      : "### Run Locally\n\nNo standard run script was detected. Ask the project owner which command should start the application.",
    "",
    analysis.buildCommand ? ["### Build", "", "```bash", analysis.buildCommand, "```"].join("\n") : "",
    "",
    analysis.testCommand ? ["### Test", "", "```bash", analysis.testCommand, "```"].join("\n") : "",
    "",
    buildConfigurationSection(analysis),
    "",
    buildScriptsSection(analysis),
    "",
    buildApiSection(analysis),
    "",
    "## Documentation",
    "",
    docsIndex(request.documentationDepth ?? "standard"),
    "",
    "## Contributing",
    "",
    "1. Fork the repository.",
    "2. Create a feature branch.",
    "3. Make focused changes with clear commits.",
    "4. Run the available checks before opening a pull request.",
    "5. Describe the motivation, implementation details, and any screenshots or API examples that help reviewers.",
    "",
    "## License",
    "",
    "No license file was detected in the sampled repository files. Confirm the intended license before distributing or reusing this project.",
    "",
    "<sub>Generated locally by mdfmt. Review and edit before publishing.</sub>",
  ]
    .filter((line) => line !== "")
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n");
}

function buildTemplateDocs(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: RepositoryAnalysis,
  title: string,
) {
  if (request.documentationDepth === "readme-only") {
    return [];
  }

  const architecture = {
    path: "docs/architecture.md",
    title: "Architecture",
    content: [
      `# ${title} Architecture`,
      "",
      "## Repository Shape",
      "",
      `The repository contains ${repository.fileTree.length} tracked files. mdfmt sampled ${repository.files.length} text files for documentation analysis.`,
      "",
      "## Detected Stack",
      "",
      repository.detectedStack.length ? repository.detectedStack.map((item) => `- ${item}`).join("\n") : "- No stack was confidently detected.",
      "",
      "## Important Entry Points",
      "",
      analysis.entrypoints.length ? analysis.entrypoints.map((file) => `- \`${file}\``).join("\n") : "- No obvious entry point was detected.",
      "",
      "## Configuration Files",
      "",
      analysis.configFiles.length ? analysis.configFiles.map((file) => `- \`${file}\``).join("\n") : "- No common configuration files were detected.",
      "",
      "## Review Notes",
      "",
      "This document is generated from static repository inspection. Confirm runtime behavior, deployment topology, and data-flow details with the project creator.",
    ].join("\n"),
  };

  if (request.documentationDepth === "standard") {
    return [architecture];
  }

  return [
    architecture,
    {
      path: "docs/development.md",
      title: "Development Guide",
      content: [
        `# ${title} Development Guide`,
        "",
        "## Setup",
        "",
        "```bash",
        `git clone ${repository.githubUrl}.git`,
        `cd ${repository.repo}`,
        analysis.installCommand,
        "```",
        "",
        "## Common Commands",
        "",
        Object.keys(analysis.scripts).length
          ? Object.entries(analysis.scripts).map(([name, command]) => `- \`${scriptCommand(analysis.packageManager, name)}\` - \`${command}\``).join("\n")
          : "No package scripts were detected.",
        "",
        "## Testing",
        "",
        analysis.tests.length ? analysis.tests.map((file) => `- \`${file}\``).join("\n") : "No test files were detected in the sampled tree.",
      ].join("\n"),
    },
    {
      path: "docs/api.md",
      title: "API Reference",
      content: [
        `# ${title} API Reference`,
        "",
        analysis.apiRoutes.length
          ? analysis.apiRoutes.map((route) => `- \`${route}\``).join("\n")
          : "No HTTP API routes were confidently detected from the sampled files.",
        "",
        "Review this file with the creator before publishing, especially if routes are registered dynamically.",
      ].join("\n"),
    },
  ];
}

// ---------------------------------------------------------------------------
// Shared utility functions
// ---------------------------------------------------------------------------

function buildBadges(repository: RepositorySnapshot, analysis: RepositoryAnalysis) {
  const badges = [
    `<img src="https://img.shields.io/badge/repo-${encodeURIComponent(repository.owner + "/" + repository.repo)}-181717?logo=github" alt="Repository" />`,
  ];

  if (analysis.dependencies.includes("typescript") || analysis.devDependencies.includes("typescript")) {
    badges.push(`<img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />`);
  }

  if (analysis.dependencies.includes("react")) {
    badges.push(`<img src="https://img.shields.io/badge/React-61dafb?logo=react&logoColor=111" alt="React" />`);
  }

  if (analysis.dependencies.includes("express")) {
    badges.push(`<img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express" />`);
  }

  return `<p align="center">\n  ${badges.join("\n  ")}\n</p>`;
}

function buildFeatureBullets(repository: RepositorySnapshot, analysis: RepositoryAnalysis) {
  const bullets = new Set<string>();

  if (analysis.components.length) bullets.add("Component-based user interface structure detected from the repository layout.");
  if (analysis.apiRoutes.length) bullets.add("HTTP API surface detected from route declarations in the source code.");
  if (analysis.scripts.build) bullets.add("Build workflow available through the package scripts.");
  if (analysis.tests.length) bullets.add("Automated test files are present for validating behavior.");
  if (repository.fileTree.some((file) => /docker/i.test(file))) bullets.add("Container-related configuration is included for deployment or local infrastructure.");
  if (repository.fileTree.some((file) => /firebase/i.test(file))) bullets.add("Firebase integration appears in the project files.");

  bullets.add("Organized source tree with configuration and implementation files separated by concern.");

  return [...bullets];
}

function buildPrerequisites(analysis: RepositoryAnalysis, stack: string[]) {
  const items = new Set<string>();
  if (analysis.packageManager === "npm" || analysis.packageManager === "pnpm" || analysis.packageManager === "yarn") {
    items.add("Node.js and the detected package manager.");
  }
  if (stack.includes("Python")) items.add("Python with pip.");
  if (stack.includes("Go")) items.add("Go toolchain.");
  if (stack.includes("Rust")) items.add("Rust toolchain.");
  if (stack.includes("Docker")) items.add("Docker, if using the container workflow.");
  if (!items.size) items.add("Install the runtime and package manager used by this repository.");
  return [...items];
}

function buildConfigurationSection(analysis: RepositoryAnalysis) {
  return [
    "## Configuration",
    "",
    analysis.envVars.length
      ? ["The following environment variables were detected in sampled source/config files:", "", analysis.envVars.map((envVar) => `- \`${envVar}\``).join("\n")].join("\n")
      : "No environment variables were confidently detected. Add a `.env.example` file if this project needs runtime configuration.",
  ].join("\n");
}

function buildScriptsSection(analysis: RepositoryAnalysis) {
  if (!Object.keys(analysis.scripts).length) {
    return "## Scripts\n\nNo package scripts were detected.";
  }

  return ["## Scripts", "", Object.entries(analysis.scripts).map(([name, command]) => `- \`${scriptCommand(analysis.packageManager, name)}\` - \`${command}\``).join("\n")].join("\n");
}

function buildApiSection(analysis: RepositoryAnalysis) {
  if (!analysis.apiRoutes.length) {
    return "## API\n\nNo explicit HTTP routes were detected from the sampled files.";
  }

  return ["## API", "", "Detected route patterns:", "", analysis.apiRoutes.map((route) => `- \`${route}\``).join("\n")].join("\n");
}

function docsIndex(depth: string) {
  if (depth === "readme-only") return "This generation requested README-only output.";
  if (depth === "complete") return "- [Architecture](docs/architecture.md)\n- [Development Guide](docs/development.md)\n- [API Reference](docs/api.md)";
  return "- [Architecture](docs/architecture.md)";
}

function buildCreatorQuestions(analysis: RepositoryAnalysis, request: BuildAiRequest) {
  const questions: string[] = [];
  if (!analysis.description) questions.push("What is the one-sentence product description you want shown at the top of the README?");
  if (!analysis.runCommand) questions.push("Which command should users run to start the project locally?");
  if (!analysis.envVars.length) questions.push("Does the project require environment variables or service credentials?");
  if (!request.instructions) questions.push("Are there brand tone, audience, or documentation sections you want enforced?");
  return questions;
}

function detectPackageManager(fileTree: string[]): RepositoryAnalysis["packageManager"] {
  if (fileTree.includes("pnpm-lock.yaml")) return "pnpm";
  if (fileTree.includes("yarn.lock")) return "yarn";
  if (fileTree.includes("package-lock.json") || fileTree.includes("package.json")) return "npm";
  if (fileTree.includes("requirements.txt") || fileTree.includes("pyproject.toml")) return "pip";
  if (fileTree.includes("Cargo.toml")) return "cargo";
  if (fileTree.includes("go.mod")) return "go";
  return "unknown";
}

function buildInstallCommand(packageManager: RepositoryAnalysis["packageManager"], fileSet: Set<string>) {
  if (packageManager === "pnpm") return "pnpm install";
  if (packageManager === "yarn") return "yarn install";
  if (packageManager === "npm") return "npm install";
  if (packageManager === "pip" && fileSet.has("requirements.txt")) return "pip install -r requirements.txt";
  if (packageManager === "pip") return "pip install -e .";
  if (packageManager === "cargo") return "cargo fetch";
  if (packageManager === "go") return "go mod download";
  return "# Install dependencies according to the project runtime";
}

function chooseScriptCommand(scripts: Record<string, string>, packageManager: RepositoryAnalysis["packageManager"], names: string[]) {
  const found = names.find((name) => scripts[name]);
  return found ? scriptCommand(packageManager, found) : undefined;
}

function scriptCommand(packageManager: RepositoryAnalysis["packageManager"], script: string) {
  if (packageManager === "pnpm") return `pnpm ${script}`;
  if (packageManager === "yarn") return `yarn ${script}`;
  return `npm run ${script}`;
}

function detectEntrypoints(repository: RepositorySnapshot) {
  return repository.fileTree
    .filter((file) => /(^|\/)(main|index|server|app)\.(ts|tsx|js|jsx|py|go|rs)$/i.test(file))
    .slice(0, 30);
}

function detectApiRoutes(repository: RepositorySnapshot) {
  const routes = new Set<string>();
  const routeRegexes = [
    /\b(?:app|router)\.(get|post|put|patch|delete)\(\s*["'`]([^"'`]+)["'`]/gi,
    /\b(?:Route|Get|Post|Put|Patch|Delete)\(\s*["'`]([^"'`]+)["'`]/gi,
  ];

  for (const file of repository.files) {
    for (const regex of routeRegexes) {
      for (const match of file.content.matchAll(regex)) {
        const method = match[2] ? match[1].toUpperCase() : "ROUTE";
        const route = match[2] ?? match[1];
        routes.add(`${method} ${route}`);
      }
    }
  }

  return [...routes].slice(0, 80);
}

function detectEnvVars(repository: RepositorySnapshot) {
  const vars = new Set<string>();
  const patterns = [/process\.env\.([A-Z0-9_]+)/g, /import\.meta\.env\.([A-Z0-9_]+)/g, /\bos\.getenv\(["'`]([A-Z0-9_]+)["'`]\)/g];

  for (const file of repository.files) {
    for (const pattern of patterns) {
      for (const match of file.content.matchAll(pattern)) {
        vars.add(match[1]);
      }
    }
  }

  return [...vars].sort();
}

function isConfigFile(file: string) {
  return /(^|\/)(vite|next|nuxt|tailwind|postcss|eslint|tsconfig|docker-compose|Dockerfile|prisma|webpack|rollup|babel|jest|vitest|playwright|cypress|firebase)\b/i.test(file);
}

function inferStackFromDeps(analysis: RepositoryAnalysis) {
  return unique([...analysis.dependencies, ...analysis.devDependencies].slice(0, 20));
}

function formatTree(files: string[]) {
  const visible = files.slice(0, 120);
  return visible.map((file) => file).join("\n") + (files.length > visible.length ? `\n...and ${files.length - visible.length} more files` : "");
}

function escapeMarkdown(value: string) {
  return value.replace(/[<>]/g, "");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}
