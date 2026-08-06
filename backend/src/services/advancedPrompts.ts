import type { RepositorySnapshot, BuildAiRequest } from "../types";
import type { AdvancedAnalysis, ApiEndpoint, ExternalIntegration, ArchitectureComponent } from "./advancedAnalysis";

/**
 * Generate comprehensive prompts for LLM-based documentation with advanced analysis
 */

export function buildAdvancedReadmePrompt(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
): string {
  const parts: string[] = [];

  parts.push("# README Generation Request");
  parts.push("");

  // Project context
  if (request.projectName) {
    parts.push(`**Project Name:** ${request.projectName}`);
  }
  parts.push(`**Repository:** ${repository.owner}/${repository.repo}`);
  parts.push(`**URL:** ${repository.githubUrl}`);
  parts.push("");

  // Special instructions
  if (request.instructions) {
    parts.push("## Special Instructions");
    parts.push(request.instructions);
    parts.push("");
  }

  // Tech stack section
  if (repository.detectedStack.length || analysis.databaseType) {
    parts.push("## Tech Stack");
    if (repository.detectedStack.length) {
      parts.push(`- **Languages & Frameworks:** ${repository.detectedStack.join(", ")}`);
    }
    if (analysis.databaseType) {
      parts.push(`- **Database:** ${analysis.databaseType}`);
    }
    parts.push("");
  }

  // Architecture overview
  if (analysis.architectureComponents.length) {
    parts.push("## Architecture Components");
    for (const component of analysis.architectureComponents.slice(0, 10)) {
      parts.push(`- **${component.name}** (${component.technologies.join(", ")})`);
      parts.push(`  - Files: ${component.files.slice(0, 3).join(", ")}`);
    }
    parts.push("");
  }

  // Design patterns
  if (analysis.designPatterns.length) {
    parts.push("## Design Patterns");
    parts.push(analysis.designPatterns.slice(0, 8).join(", "));
    parts.push("");
  }

  // Core features
  if (analysis.coreFeatures.length) {
    parts.push("## Core Features");
    for (const feature of analysis.coreFeatures) {
      parts.push(`- ${feature}`);
    }
    parts.push("");
  }

  // API Endpoints
  if (analysis.apiEndpoints.length) {
    parts.push("## API Endpoints");
    for (const endpoint of analysis.apiEndpoints.slice(0, 30)) {
      parts.push(`- **${endpoint.method}** \`${endpoint.path}\` - ${endpoint.description}`);
    }
    parts.push("");
  }

  // External Integrations
  if (analysis.externalIntegrations.length) {
    parts.push("## External Integrations & APIs");
    for (const integration of analysis.externalIntegrations.slice(0, 15)) {
      parts.push(`- **${integration.name}** (${integration.type})`);
      if (integration.environmentVariables?.length) {
        parts.push(`  - Environment: ${integration.environmentVariables.join(", ")}`);
      }
      if (integration.endpoints?.length) {
        parts.push(`  - Endpoints: ${integration.endpoints.slice(0, 2).join(", ")}`);
      }
    }
    parts.push("");
  }

  // Authentication
  if (analysis.authMethods.length) {
    parts.push("## Authentication Methods");
    for (const method of analysis.authMethods) {
      parts.push(`- ${method}`);
    }
    parts.push("");
  }

  // Source files (samples)
  if (repository.files.length) {
    parts.push("## Source Code Samples");
    let budget = 3000;
    for (const file of repository.files.slice(0, 5)) {
      if (budget <= 0) break;
      const content = file.content.slice(0, Math.min(file.content.length, budget));
      parts.push(`\n### File: ${file.path}`);
      parts.push(`\`\`\`${file.language.toLowerCase()}`);
      parts.push(content);
      parts.push("```");
      budget -= content.length;
    }
  }

  return parts.join("\n");
}

export function buildAdvancedReadmeSystemPrompt(): string {
  return `You are a world-class Staff Software Engineer and Lead Open-Source Documentation Writer. Your mission is to generate a pristine, human-written, highly engaging, and clear GitHub README.md for a repository based on its source code snapshot and architectural metadata.

## Core Writing Directives (Human-Centric & Professional):

1. **Human, Natural Tone**: Write like an articulate lead developer describing their project to peer software engineers. Be clear, direct, engaging, and genuinely informative.
2. **STRICTLY BAN Robotic & Repetitive Buzzwords**:
   - DO NOT write repetitive filler lines like "Engineered using modern paradigms and toolchains" or "Built with X for high performance and reliability" over and over.
   - DO NOT use generic template fluff or mechanical boilerplate. Every sentence must communicate real, meaningful technical information specific to this codebase.
3. **Deep Technical Clarity**:
   - Infer the project's core purpose, business logic, and architecture from the provided files, package manifests, and endpoints.
   - Explain *what problem this project solves*, *why it exists*, and *how developers should interact with it*.
4. **Visual & Structural Excellence**:
   - Use clean GitHub-Flavored Markdown.
   - Include standard project status badges at the top (version, license, tech stack).
   - Use standard section headers with clean spacing and subtle markdown emojis.
   - Provide Mermaid.js diagrams (\`\`\`mermaid ... \`\`\`) for architecture or data flow where helpful.
   - Format structured data (API parameters, config options, scripts) into clean Markdown tables.

## Required README Sections:

1. **Header & Badges**: Project name, tagline, badges (License, Tech Stack, Version).
2. **Overview / What It Solves**: 2-3 clear paragraphs explaining the project's value proposition, key use cases, and design goals.
3. **Key Features**: A bulleted list of actual features extracted from code, routes, and component signatures.
4. **Architecture & Project Structure**:
   - Overview of the system layout.
   - An annotated ASCII folder tree of key directories.
   - (Optional) A Mermaid.js flow diagram illustrating component interactions.
5. **Available Scripts & Commands** (if package/manifest contains scripts): A clear Markdown table listing npm/cargo/python scripts with human-readable explanations of what each command does.
6. **Getting Started & Setup**:
   - Prerequisites (required runtimes, language versions).
   - Installation steps (clone, install dependencies).
   - Local dev execution & production build instructions.
7. **Configuration / Environment Variables** (if env variables or configs are detected): A table listing environment variables, their purpose, and default values.
8. **API Reference** (if API endpoints exist): Organized table of HTTP methods, routes, descriptions, and request payload details.
9. **Code Example / Usage**: Real code snippet showing how to use, import, or call the core functionality.
10. **Contributing & License**: Clean open-source contribution guidelines and license note.

## Output Constraints:
- Output ONLY valid, raw markdown.
- Do NOT wrap the entire output in a markdown code block (no outer \`\`\`markdown ... \`\`\`).
- Start directly with the project header.`;
}

export function buildArchitectureDocumentPrompt(
  project: string,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
): string {
  const parts: string[] = [];

  parts.push(`# Architecture Documentation for ${project}`);
  parts.push("");
  parts.push("Generate comprehensive architecture documentation with:");
  parts.push("");
  parts.push("## Sections to Include:");
  parts.push("");
  parts.push("### 1. System Overview");
  parts.push("- High-level description of what the system does");
  parts.push("- Main purpose and goals");
  parts.push("- Scale and performance characteristics");
  parts.push("");

  parts.push("### 2. Architecture Components");
  for (const component of analysis.architectureComponents.slice(0, 12)) {
    parts.push(`- **${component.name}**: ${component.purpose}`);
    parts.push(`  - Technologies: ${component.technologies.join(", ")}`);
    parts.push(`  - Key Files: ${component.files.slice(0, 2).join(", ")}`);
  }
  parts.push("");

  parts.push("### 3. Data Flow");
  parts.push("- How requests flow through the system");
  parts.push("- Database interaction patterns");
  parts.push("- Caching strategies (if applicable)");
  parts.push("");

  if (analysis.apiEndpoints.length) {
    parts.push("### 4. API Layer");
    parts.push("- Endpoint organization");
    parts.push("- Request/response patterns");
    parts.push("- Authentication flow");
    parts.push(`- Key endpoints: ${analysis.apiEndpoints.slice(0, 5).map((e) => `${e.method} ${e.path}`).join(", ")}`);
    parts.push("");
  }

  if (analysis.externalIntegrations.length) {
    parts.push("### 5. External Integrations");
    parts.push("- Services integrated:");
    for (const integration of analysis.externalIntegrations.slice(0, 8)) {
      parts.push(`  - ${integration.name} (${integration.type})`);
    }
    parts.push("");
  }

  parts.push("### 6. Design Patterns");
  for (const pattern of analysis.architecturePatterns.slice(0, 8)) {
    parts.push(`- **${pattern.pattern}**: ${pattern.description}`);
  }
  parts.push("");

  parts.push("### 7. Scalability & Performance");
  parts.push("- Caching strategy");
  parts.push("- Database optimization");
  parts.push("- Potential bottlenecks and solutions");
  parts.push("");

  parts.push("### 8. Security Considerations");
  for (const authMethod of analysis.authMethods) {
    parts.push(`- ${authMethod}`);
  }
  parts.push("- Input validation");
  parts.push("- API rate limiting (if applicable)");
  parts.push("");

  parts.push("### 9. Deployment");
  parts.push("- Environment setup");
  parts.push("- Database migrations");
  parts.push("- Configuration management");
  parts.push("");

  // Source files for reference
  parts.push("## Code Reference");
  for (const file of repository.files.slice(0, 4)) {
    parts.push(`\n### ${file.path}`);
    parts.push("```");
    parts.push(file.content.slice(0, 800));
    parts.push("```");
  }

  return parts.join("\n");
}

export function buildArchitectureDocumentSystemPrompt(): string {
  return `You are a senior software architect writing internal technical documentation for development teams. 

Your architecture documentation should be:
- Technically accurate and detailed
- Focused on helping developers understand the system structure
- Include practical examples from the actual code
- Reference real file paths and module names
- Explain design decisions and trade-offs

Output only raw markdown content, no code fences wrapping the entire document, no emojis.`;
}

export function buildApiReferencePrompt(
  project: string,
  analysis: AdvancedAnalysis,
  repository: RepositorySnapshot,
): string {
  const parts: string[] = [];

  parts.push(`# API Reference for ${project}`);
  parts.push("");

  if (analysis.apiEndpoints.length === 0) {
    parts.push("This project does not expose HTTP API endpoints.");
    return parts.join("\n");
  }

  // Group endpoints by path prefix
  const grouped = groupEndpointsByPrefix(analysis.apiEndpoints);

  for (const [prefix, endpoints] of grouped) {
    parts.push(`## ${prefix || "General"} Endpoints`);
    parts.push("");
    parts.push("| Method | Path | Description |");
    parts.push("|--------|------|-------------|");
    for (const endpoint of endpoints) {
      parts.push(`| ${endpoint.method} | \`${endpoint.path}\` | ${endpoint.description || "N/A"} |`);
    }
    parts.push("");
  }

  // Authentication section
  if (analysis.authMethods.length) {
    parts.push("## Authentication");
    for (const method of analysis.authMethods) {
      parts.push(`- ${method}`);
    }
    parts.push("");
  }

  // External APIs
  if (analysis.externalIntegrations.length) {
    parts.push("## External APIs Used");
    for (const integration of analysis.externalIntegrations.slice(0, 10)) {
      parts.push(`- **${integration.name}**: ${integration.description}`);
      if (integration.environmentVariables?.length) {
        parts.push(`  - Config: ${integration.environmentVariables.join(", ")}`);
      }
    }
  }

  return parts.join("\n");
}

export function buildApiReferenceSystemPrompt(): string {
  return `You are a senior API documentation writer. Create comprehensive, developer-friendly API reference documentation.

For each endpoint, provide:
- Clear description of purpose
- HTTP method and path
- Query parameters (if any)
- Request body schema/example
- Response format with example
- Error handling

Format as markdown tables where appropriate. Output only raw markdown, no code fences, no emojis.`;
}

export function buildSetupGuidePrompt(project: string, analysis: AdvancedAnalysis): string {
  const parts: string[] = [];

  parts.push(`# Setup & Development Guide for ${project}`);
  parts.push("");
  parts.push("## Prerequisites");
  parts.push("- Node.js (specify version if known)");
  parts.push("- Package manager (npm/yarn/pnpm)");
  parts.push("- Git");
  parts.push("");

  parts.push("## Installation Steps");
  parts.push("1. Clone the repository");
  parts.push("2. Install dependencies");
  parts.push("3. Configure environment variables");
  parts.push("4. Run database migrations (if applicable)");
  parts.push("5. Start the development server");
  parts.push("");

  if (analysis.coreFeatures.length) {
    parts.push("## Features to Configure");
    for (const feature of analysis.coreFeatures.slice(0, 10)) {
      parts.push(`- ${feature}`);
    }
    parts.push("");
  }

  if (analysis.externalIntegrations.length) {
    parts.push("## External Service Setup");
    for (const integration of analysis.externalIntegrations.slice(0, 8)) {
      parts.push(`### ${integration.name}`);
      if (integration.environmentVariables?.length) {
        parts.push(`- Environment variables: ${integration.environmentVariables.join(", ")}`);
      }
      parts.push(`- Type: ${integration.type}`);
      parts.push("");
    }
  }

  parts.push("## Development Commands");
  parts.push("- **npm run dev** - Start development server");
  parts.push("- **npm run build** - Build for production");
  parts.push("- **npm test** - Run tests");
  parts.push("- **npm run lint** - Check code style");
  parts.push("");

  parts.push("## Environment Configuration");
  parts.push("Create a `.env.local` file with the required variables.");
  parts.push("See `.env.example` for all available options.");

  return parts.join("\n");
}

export function buildSetupGuideSystemPrompt(): string {
  return `You are an expert onboarding specialist. Write clear, step-by-step setup guides for developers.

Your guide should:
- Be beginner-friendly with no assumed knowledge
- Include actual command examples from the project
- Cover all dependencies and services
- Explain each step's purpose
- Include troubleshooting for common issues

Output only raw markdown, no code fences, no emojis.`;
}

// ================================================================================
// HELPER FUNCTIONS
// ================================================================================

function groupEndpointsByPrefix(endpoints: ApiEndpoint[]): Map<string, ApiEndpoint[]> {
  const grouped = new Map<string, ApiEndpoint[]>();

  for (const endpoint of endpoints) {
    const parts = endpoint.path.split("/");
    const prefix = parts[1] || "General";

    if (!grouped.has(prefix)) {
      grouped.set(prefix, []);
    }
    grouped.get(prefix)!.push(endpoint);
  }

  return grouped;
}
