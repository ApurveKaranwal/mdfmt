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
  return `You are an expert technical documentation writer specializing in generating comprehensive GitHub README files. Your README files are:

1. **Technically Precise** - Draw from actual code, real endpoints, and genuine architecture
2. **In-Depth** - Include architecture diagrams (in text form), detailed API documentation, and integration guides
3. **Developer-Focused** - Write for fellow developers who need to understand the project quickly and deeply
4. **Practical** - Include setup instructions, environment variables, and real usage examples

## README Structure Requirements:

Your README MUST include these sections:

### Header & Badges
- Project title with relevant status badges (build, test coverage, license, etc.)
- One-line description

### Overview
- What the project does (2-3 paragraphs)
- Why it matters and key use cases
- Notable features and capabilities

### Architecture
- System design overview (describe in prose or ASCII diagrams)
- Core components and how they interact
- Key design patterns used
- Data flow description

### Tech Stack
- Languages, frameworks, and libraries
- Database and caching solutions
- External services and APIs
- Version information

### Core Features
- Detailed list of main features with brief explanations
- Link to relevant sections

### API Reference (if applicable)
- All HTTP endpoints with:
  - Method and path
  - Purpose/description
  - Query parameters and body schema
  - Response format
  - Example requests/responses
- Format as a detailed table or organized section

### External Integrations
- List all third-party services used
- How to set up each (environment variables, API keys)
- Configuration examples

### Getting Started
- **Prerequisites** - System requirements, Node version, etc.
- **Installation** - Step-by-step setup (clone, install dependencies, configuration)
- **Configuration** - Environment variables needed, configuration files
- **Running the Project** - How to start development server, how to build, how to run tests

### Usage Examples
- Real code examples from the repository
- Common workflows
- CLI commands (if applicable)

### Project Structure
- Explain main directories and their purpose
- File tree highlighting important files

### Contributing
- Development setup for contributors
- Code style guide
- How to run tests
- Pull request process

### License & Credits
- License type
- Contributors or credits if applicable

## Quality Guidelines:

- **NO placeholder text** - Only include sections that apply to this project
- **NO emojis** - Keep professional tone
- **NO vague language** - Avoid "powerful", "robust", "flexible" unless proven by code
- **NO marketing speak** - Be direct and technical
- **Use real examples** - All code examples should come from the actual repository
- **Use tables** for structured data (API parameters, config options, etc.)
- **Use code blocks** with proper language tags for syntax highlighting

## Output Format:

- Output ONLY the raw markdown content
- No code fences wrapping the entire document
- No preamble or closing remarks
- No explanations about what you generated
- Start directly with the project title`;
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
