import type { RepositorySnapshot } from "../types";
import type { AdvancedAnalysis, ApiEndpoint, ExternalIntegration, ArchitectureComponent } from "./advancedAnalysis";
import { polishText } from "./mlEngine";

/**
 * In-house Documentation Writer
 * Generates professional, in-depth documentation without external LLM dependencies
 */

export interface DocumentationOutput {
  readme: string;
  architecture: string;
  apiReference: string;
  setupGuide: string;
  integrations: string;
}

/**
 * Main document generator using intelligent templates and rules
 */
export function generateDocumentation(
  projectName: string,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
  customInstructions?: string,
): DocumentationOutput {
  return {
    readme: generateReadme(projectName, repository, analysis, customInstructions),
    architecture: generateArchitecture(projectName, repository, analysis),
    apiReference: generateApiReference(projectName, analysis),
    setupGuide: generateSetupGuide(projectName, repository, analysis),
    integrations: generateIntegrations(projectName, analysis),
  };
}

// ================================================================================
// README GENERATION
// ================================================================================

function generateReadme(
  projectName: string,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
  customInstructions?: string,
): string {
  const sections: string[] = [];

  // Title and badges
  sections.push(`<p align="center">
  <img src="https://raw.githubusercontent.com/otoyo/badge-generator/main/assets/badge.svg" alt="${projectName} Banner" width="200" style="margin-bottom: 20px;" />
</p>

# ${projectName}

${generateBadges(repository, analysis)}
`);

  // Description
  const description = analysis.projectSummary || generateProjectDescription(projectName, analysis);
  sections.push(`\n## 📝 Project Overview\n\n${description}\n`);

  // Quick highlights
  if (analysis.coreFeatures.length > 0) {
    sections.push("## ✨ Key Features & Capabilities\n");
    analysis.coreFeatures.slice(0, 10).forEach((feature) => {
      sections.push(`- **${polishText(feature)}**`);
    });
    sections.push("");
  }

  // Tech Stack
  sections.push(generateTechStackSection(repository, analysis));

  // Architecture Overview
  sections.push(generateArchitectureOverview(analysis));

  // API Endpoints (if present)
  if (analysis.apiEndpoints.length > 0) {
    sections.push(generateApiEndpointsPreview(analysis.apiEndpoints));
  }

  // Integrations Summary
  if (analysis.externalIntegrations.length > 0) {
    sections.push(generateIntegrationsSummary(analysis.externalIntegrations));
  }

  // Getting Started
  sections.push(generateGettingStarted(repository, analysis));

  // Project Structure
  sections.push(generateProjectStructure(repository));

  // Configuration
  sections.push(generateConfigurationSection(analysis));

  // Development
  sections.push(generateDevelopmentSection(repository, analysis));

  // Contributing
  sections.push(`
## 🤝 Contributing

We welcome community contributions! Follow these steps to contribute:
1. **Fork** the Repository.
2. Create a **Feature Branch** (\`git checkout -b feature/amazing-feature\`).
3. **Commit** your changes with clear messages (\`git commit -m 'Add amazing feature'\`).
4. **Push** the branch (\`git push origin feature/amazing-feature\`).
5. Open a **Pull Request** for review.
`);

  // License
  sections.push(`
## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
`);

  // Custom instructions
  if (customInstructions) {
    sections.push(`
---

### 💡 Special Developer Instructions Considered:
> [!NOTE]
> ${customInstructions}
`);
  }

  return sections.filter((s) => s.trim()).join("\n");
}

function generateBadges(repository: RepositorySnapshot, analysis: AdvancedAnalysis): string {
  const badges: string[] = [];

  badges.push(`[![GitHub](https://img.shields.io/badge/Repository-${repository.owner}%2F${repository.repo}-181717?style=for-the-badge&logo=github)](${repository.githubUrl})`);

  if (repository.detectedStack.includes("TypeScript")) {
    badges.push("![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)");
  }
  if (repository.detectedStack.includes("React")) {
    badges.push("![React](https://img.shields.io/badge/React-61dafb?style=for-the-badge&logo=react&logoColor=333)");
  }
  if (repository.detectedStack.includes("Node.js")) {
    badges.push("![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)");
  }
  if (repository.detectedStack.includes("Python")) {
    badges.push("![Python](https://img.shields.io/badge/Python-3776ab?style=for-the-badge&logo=python&logoColor=white)");
  }

  if (analysis.databaseType) {
    const dbName = analysis.databaseType.split(" ")[0];
    badges.push(`![Database](https://img.shields.io/badge/Database-${dbName}-2f80ed?style=for-the-badge)`);
  }

  if (analysis.apiEndpoints.length > 0) {
    badges.push(`![API](https://img.shields.io/badge/API_Endpoints-${analysis.apiEndpoints.length}-27ae60?style=for-the-badge)`);
  }

  return `<p align="center">\n  ${badges.join("\n  ")}\n</p>`;
}

function generateProjectDescription(projectName: string, analysis: AdvancedAnalysis): string {
  const features = analysis.coreFeatures.slice(0, 3);
  const hasAuth = analysis.authMethods.length > 0;
  const hasApi = analysis.apiEndpoints.length > 0;

  let description = `**${projectName}** is an advanced codebase built with modern technologies. It provides `;

  const capabilities: string[] = [];
  if (hasApi) capabilities.push("a robust REST/HTTP API server");
  if (hasAuth) capabilities.push("secure session/token-based authentication");
  if (features.length > 0) capabilities.push(features[0].toLowerCase());

  description += capabilities.join(", ");
  description += ". ";

  if (analysis.databaseType) {
    description += `It leverages **${analysis.databaseType}** for data consistency and state management, providing `;
  } else {
    description += "It includes ";
  }

  if (features.length > 1) {
    description += `capabilities like ${features.slice(1).join(", ").toLowerCase()}`;
  } else {
    description += "well-tested, modular structural implementations";
  }

  description += ". Built with performance, modular scalability, and code readability in mind.";

  return description;
}

function generateTechStackSection(repository: RepositorySnapshot, analysis: AdvancedAnalysis): string {
  const sections: string[] = ["\n## 🛠️ Tech Stack & Dependencies\n"];

  if (repository.detectedStack.length > 0) {
    sections.push("### Languages & Runtimes\n");
    repository.detectedStack.forEach((tech) => {
      sections.push(`- **${tech}** - Direct platform integration`);
    });
    sections.push("");
  }

  if (analysis.databaseType) {
    sections.push(`### Database & Storage\n- **${analysis.databaseType}**\n`);
  }

  if (analysis.externalIntegrations.length > 0) {
    sections.push("### Service Integrations\n");
    analysis.externalIntegrations.slice(0, 8).forEach((integration) => {
      sections.push(`- **${integration.name}** (${integration.type}) - ${integration.description}`);
    });
    sections.push("");
  }

  return sections.join("\n");
}

function generateArchitectureOverview(analysis: AdvancedAnalysis): string {
  const sections: string[] = ["\n## 🏗️ Architecture Design Patterns\n"];

  sections.push("### High-Level Component Flow\n\n```text");
  sections.push("  ┌──────────────────────────────────────────────────────────┐");
  sections.push("  │                  Client UI / Consumer                    │");
  sections.push("  └───────────────────────────┬──────────────────────────────┘");
  sections.push("                              │ HTTP Request / Payload");
  sections.push("                              ▼");
  sections.push("  ┌──────────────────────────────────────────────────────────┐");
  sections.push("  │                 API Controller & Router                  │");
  sections.push("  └───────────────────────────┬──────────────────────────────┘");
  sections.push("                              │ Middleware Validations");
  sections.push("                              ▼");
  sections.push("  ┌──────────────────────────────────────────────────────────┐");
  sections.push("  │            Core Business Services & Logic Layer          │");
  sections.push("  └───────────────────────────┬──────────────────────────────┘");
  sections.push("                              │ Entity DB Mapping / ORM");
  sections.push("                              ▼");
  sections.push("  ┌──────────────────────────────────────────────────────────┐");
  sections.push("  │                  Database / Storage engine               │");
  sections.push("  └──────────────────────────────────────────────────────────┘");
  sections.push("```\n");

  if (analysis.architecturePatterns.length > 0) {
    sections.push("### Architectural Patterns In Use\n");
    analysis.architecturePatterns.slice(0, 5).forEach((pattern) => {
      sections.push(`- **${pattern.pattern}**: ${pattern.description}`);
    });
    sections.push("");
  }

  if (analysis.designPatterns.length > 0) {
    sections.push("### Clean Code Patterns Detected\n");
    analysis.designPatterns.slice(0, 6).forEach((pattern) => {
      sections.push(`- **${pattern}**`);
    });
    sections.push("");
  }

  return sections.join("\n");
}

function generateApiEndpointsPreview(endpoints: ApiEndpoint[]): string {
  if (endpoints.length === 0) return "";

  const sections: string[] = ["\n## 📡 API Reference Preview\n"];

  // Group endpoints by prefix
  const grouped = new Map<string, ApiEndpoint[]>();
  for (const endpoint of endpoints) {
    const prefix = endpoint.path.split("/")[1] || "general";
    if (!grouped.has(prefix)) grouped.set(prefix, []);
    grouped.get(prefix)!.push(endpoint);
  }

  // Show first 4 groups
  let count = 0;
  for (const [prefix, eps] of Array.from(grouped.entries()).slice(0, 4)) {
    sections.push(`### Module: \`/${prefix}\`\n`);
    sections.push("| Method | Route Endpoint | Purpose / Handler Description |");
    sections.push("|:---|:---|:---|");
    for (const endpoint of eps.slice(0, 5)) {
      const desc = endpoint.description.slice(0, 80);
      sections.push(`| \`${endpoint.method}\` | \`${endpoint.path}\` | ${desc} |`);
      count++;
    }
    sections.push("");
  }

  sections.push(`\n> [!TIP]\n> Detailed specifications and schemas are available in [API Reference](docs/api-reference.md) for all endpoints.\n`);

  return sections.join("\n");
}

function generateIntegrationsSummary(integrations: ExternalIntegration[]): string {
  if (integrations.length === 0) return "";

  const sections: string[] = ["\n## 🔗 External Service Integrations\n"];

  sections.push("This application interfaces with the following APIs & Providers:\n");
  integrations.slice(0, 10).forEach((integration) => {
    sections.push(`- **${integration.name}** (\`${integration.type}\`) - ${integration.description}`);
    if (integration.environmentVariables && integration.environmentVariables.length > 0) {
      sections.push(`  - *Configured Variables:* \`${integration.environmentVariables.join(", ")}\``);
    }
  });

  sections.push(`\n> [!NOTE]\n> Read the [Integrations Guide](docs/integrations.md) to learn how to acquire sandbox credentials and configure providers.\n`);

  return sections.join("\n");
}

function generateGettingStarted(repository: RepositorySnapshot, analysis: AdvancedAnalysis): string {
  const sections: string[] = ["\n## 🚀 Quick Start Guide\n"];

  sections.push("### Prerequisites\n");
  const prereqs = getPrerequisites(repository, analysis);
  prereqs.forEach((p) => sections.push(`- **${p}**`));
  sections.push("");

  sections.push("### 📦 Installation\n");
  sections.push("```bash");
  sections.push(`git clone ${repository.githubUrl}.git`);
  sections.push(`cd ${repository.repo}`);
  sections.push(getInstallCommand(repository));
  sections.push("```\n");

  sections.push("### ⚙️ Environment Setup\n");
  sections.push("Duplicate the template config file and configure local credentials:\n");
  sections.push("```bash");
  sections.push("cp .env.example .env");
  sections.push("```\n");

  sections.push("### 🏃 Running Locally\n");
  sections.push("```bash");
  sections.push(getRunCommand(repository));
  sections.push("```\n");

  return sections.join("\n");
}

function generateProjectStructure(repository: RepositorySnapshot): string {
  const sections: string[] = ["\n## 📁 Directory Structure\n"];

  sections.push("```text");
  const rootFiles = repository.fileTree.filter((f) => !f.includes("/")).slice(0, 8);
  const dirs = repository.fileTree
    .filter((f) => f.includes("/") && f.split("/").length === 2)
    .map((f) => f.split("/")[0])
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 10);

  dirs.forEach((d) => sections.push(`${d}/`));
  rootFiles.forEach((f) => sections.push(f));
  sections.push("  ...");
  sections.push("```\n");

  sections.push("### Architecture Concerns Mapping\n");
  if (dirs.includes("src")) sections.push("- **src/** - Main application codebase");
  if (dirs.includes("backend")) sections.push("- **backend/** - Server-side components, middleware routes, services");
  if (dirs.includes("frontend")) sections.push("- **frontend/** - Client-side UI, layouts, pages, modules");
  if (dirs.includes("docs")) sections.push("- **docs/** - Supplementary design and architectural documentation");
  if (dirs.includes("tests")) sections.push("- **tests/** - Testing fixtures, mocks, unit/integration runs");

  return sections.join("\n");
}

function generateConfigurationSection(analysis: AdvancedAnalysis): string {
  const sections: string[] = ["\n## ⚙️ Settings & Environment Configuration\n"];

  const envVars = new Set<string>();
  analysis.externalIntegrations.forEach((integration) => {
    integration.environmentVariables?.forEach((v) => envVars.add(v));
  });

  if (envVars.size === 0) {
    sections.push("No environment variables are detected in standard usage. Standard config files govern local runs.\n");
    return sections.join("\n");
  }

  sections.push("Ensure these environment variables are populated in your local `.env` file:\n");
  sections.push("| Variable Name | Requirement | Default Fallback Value |");
  sections.push("|:---|:---|:---|");
  Array.from(envVars)
    .slice(0, 15)
    .forEach((envVar) => {
      sections.push(`| \`${envVar}\` | Required for related provider module setup | *N/A (user-defined)* |`);
    });
  sections.push("");

  return sections.join("\n");
}

function generateDevelopmentSection(repository: RepositorySnapshot, analysis: AdvancedAnalysis): string {
  const sections: string[] = ["\n## 💻 Local Development & Verification\n"];

  sections.push("### Standard Scripts\n");
  sections.push("The following lifecycle scripts are defined to verify, format, and run code:\n");
  sections.push("```bash");
  sections.push(`${getRunCommand(repository)}      # Starts hot-reloaded development environment`);
  sections.push("npm run build    # Compiles source for production distribution");
  sections.push("npm run test     # Triggers test fixtures run");
  sections.push("npm run lint     # Validates coding style and constraints");
  sections.push("```\n");

  sections.push("### Development Rules\n");
  sections.push("- Keep functions small, testable, and isolated.");
  sections.push("- Adhere to the established architecture layer constraints.");
  sections.push("- Run lint checks and verify build compiles cleanly before making pull requests.\n");

  return sections.join("\n");
}

function getPrerequisites(repository: RepositorySnapshot, analysis: AdvancedAnalysis): string[] {
  const prereqs: string[] = [];

  if (repository.detectedStack.includes("Node.js") || repository.detectedStack.includes("TypeScript")) {
    prereqs.push("Node.js runtime environment (v18.x or above)");
    prereqs.push("Package manager: npm or yarn");
  }
  if (repository.detectedStack.includes("Python")) {
    prereqs.push("Python interpreter (v3.10+)");
    prereqs.push("pip virtualenv manager");
  }
  if (analysis.databaseType) {
    prereqs.push(`An active, configured ${analysis.databaseType} instance`);
  }

  return prereqs.length > 0 ? prereqs : ["Node.js v18+", "npm/yarn package manager"];
}

function getInstallCommand(repository: RepositorySnapshot): string {
  if (repository.fileTree.includes("package.json")) return "npm install";
  if (repository.fileTree.includes("requirements.txt")) return "pip install -r requirements.txt";
  if (repository.fileTree.includes("Cargo.toml")) return "cargo build";
  if (repository.fileTree.includes("go.mod")) return "go mod download";
  return "npm install";
}

function getRunCommand(repository: RepositorySnapshot): string {
  if (repository.fileTree.includes("package.json")) return "npm run dev";
  if (repository.fileTree.includes("main.py")) return "python main.py";
  if (repository.fileTree.includes("main.go")) return "go run main.go";
  return "npm start";
}

// ================================================================================
// ARCHITECTURE DOCUMENTATION
// ================================================================================

function generateArchitecture(
  projectName: string,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
): string {
  const sections: string[] = [];

  sections.push(`# ${projectName} - Architecture Documentation\n`);

  sections.push("## System Architecture Overview\n");
  sections.push(
    `This document describes the structural design, component topology, and technical design patterns governing **${projectName}**.\n`
  );

  // Components
  sections.push("## Architectural Components Layering\n");
  analysis.architectureComponents.forEach((component) => {
    sections.push(`\n### Component Area: ${component.name}\n`);
    sections.push(`**Purpose:** ${component.purpose}\n`);
    sections.push(`**Tech Stack:** \`${component.technologies.join(", ")}\`\n`);
    sections.push("**Sample Modules/Files:**");
    component.files.slice(0, 5).forEach((file) => {
      sections.push(`- \`${file}\``);
    });
    
    if (component.exportedSignatures && component.exportedSignatures.length > 0) {
      sections.push("\n**Exported AST Signatures:**");
      sections.push("```typescript");
      component.exportedSignatures.forEach(sig => {
        sections.push(sig);
      });
      sections.push("```");
    }
    
    sections.push("");
  });

  // Data Flow
  sections.push("\n## Data Flow Request Lifecycle\n");
  sections.push("```text");
  sections.push("  [Browser / Client] ─── (HTTP requests) ───► [API Router]");
  sections.push("                                                  │");
  sections.push("                                                  ▼");
  sections.push("                                        [Middleware Validators]");
  sections.push("                                                  │");
  sections.push("                                                  ▼");
  sections.push("                                        [Business Services Layer]");
  sections.push("                                                  │");
  sections.push("                                                  ▼");
  sections.push("                                        [Database ORM Adapters]");
  sections.push("                                                  │");
  sections.push("                                                  ▼");
  sections.push("                                        [Relational/NoSQL Database]");
  sections.push("```\n");

  // Design Patterns
  if (analysis.architecturePatterns.length > 0) {
    sections.push("## Clean Design Patterns Utilized\n");
    analysis.architecturePatterns.forEach((pattern) => {
      sections.push(`\n### Pattern: ${pattern.pattern}\n`);
      sections.push(`*Rationale:* ${pattern.description}\n`);
      sections.push(`*Keywords:* \`${pattern.examples.join(", ")}\`\n`);
    });
  }

  // Security
  sections.push("\n## Security & Authorization Layout\n");
  if (analysis.authMethods.length > 0) {
    sections.push("### Integrated Security Mechanisms\n");
    analysis.authMethods.forEach((method) => {
      sections.push(`- **${method}**`);
    });
    sections.push("");
  }

  sections.push(`
### Best Practice Constraints Applied:
1. **Input Sanitization**: Request validation checks to block injections.
2. **Access Control**: Dynamic handler check layers.
3. **Environment Separation**: Absolute segregation of credentials via \`.env\` configurations.
`);

  // Database
  if (analysis.databaseType) {
    sections.push("\n## Database Schemas & Data Model Layout\n");
    sections.push(`**Storage Type:** ${analysis.databaseType}\n`);
    if (analysis.dataModels.length > 0) {
      sections.push("### Data Models Defined:\n");
      analysis.dataModels.slice(0, 8).forEach((model) => {
        sections.push(`\n#### Model Entity: \`${model.name}\``);
        if (model.fields.length > 0) {
          sections.push(`*Associated Fields:* \`${model.fields.join(", ")}\``);
        }
        if (model.sourceFile) {
          sections.push(`*File Source:* \`${model.sourceFile}\``);
        }
      });
      sections.push("");
    }
  }

  return sections.join("\n");
}

// ================================================================================
// API REFERENCE GENERATION
// ================================================================================

function generateApiReference(projectName: string, analysis: AdvancedAnalysis): string {
  if (analysis.apiEndpoints.length === 0) {
    return `# ${projectName} - API Reference\n\nNo endpoints or HTTP routes were detected in static analysis.\n`;
  }

  const sections: string[] = [];

  sections.push(`# ${projectName} - API Reference & Specifications\n`);

  if (analysis.authMethods.length > 0) {
    sections.push("## Request Authentication\n");
    sections.push("The endpoints require the following headers for validation:\n");
    analysis.authMethods.forEach((method) => {
      sections.push(`- **${method}**`);
    });
    sections.push("");
  }

  // Group endpoints by prefix
  const grouped = new Map<string, ApiEndpoint[]>();
  for (const endpoint of analysis.apiEndpoints) {
    const parts = endpoint.path.split("/");
    const prefix = parts[1] || "general";
    if (!grouped.has(prefix)) grouped.set(prefix, []);
    grouped.get(prefix)!.push(endpoint);
  }

  // Generate documentation for each group
  sections.push("## Endpoint Details\n");
  for (const [prefix, endpoints] of grouped.entries()) {
    sections.push(`\n### API Domain Prefix: \`/${prefix}\`\n`);
    sections.push("| HTTP Method | Request Path Endpoint | Handler Purpose / Code Location |");
    sections.push("|:---|:---|:---|");
    for (const endpoint of endpoints) {
      sections.push(`| \`${endpoint.method}\` | \`${endpoint.path}\` | ${endpoint.description} (in \`${endpoint.sourceFile || 'routes'}\`) |`);
    }
    sections.push("");
  }

  // Example request/response
  sections.push("\n## Standard Response Envelope Structure\n");
  sections.push("All successful payloads return a consistent schema structure:");
  sections.push("```json");
  sections.push("{");
  sections.push('  "success": true,');
  sections.push('  "data": {');
  sections.push('    /* Response Object payload here */');
  sections.push('  },');
  sections.push('  "timestamp": "2026-06-09T13:00:00.000Z"');
  sections.push("}");
  sections.push("```\n");

  return sections.join("\n");
}

// ================================================================================
// SETUP GUIDE GENERATION
// ================================================================================

function generateSetupGuide(projectName: string, repository: RepositorySnapshot, analysis: AdvancedAnalysis): string {
  const sections: string[] = [];

  sections.push(`# ${projectName} - Local Machine Setup Guide\n`);

  sections.push("## 🛠️ Step-by-Step Installation\n");

  sections.push("### 1. Clone Source Files\n");
  sections.push("```bash");
  sections.push(`git clone ${repository.githubUrl}.git`);
  sections.push(`cd ${repository.repo}`);
  sections.push("```\n");

  sections.push("### 2. Dependency Resolution\n");
  sections.push("Run the following installation command in the main directory:\n");
  sections.push("```bash");
  sections.push(getInstallCommand(repository));
  sections.push("```\n");

  sections.push("### 3. Setup Configuration Variables\n");
  sections.push("Copy the template configuration files:\n");
  sections.push("```bash");
  sections.push("cp .env.example .env");
  sections.push("```\n");

  if (analysis.externalIntegrations.length > 0 || analysis.databaseType) {
    sections.push("Configure variables for database and external integrations in `.env`:\n");
    sections.push("```env");
    if (analysis.databaseType) {
      sections.push("DATABASE_URL=your_db_connection_string");
    }
    analysis.externalIntegrations.forEach((integration) => {
      integration.environmentVariables?.forEach((envVar) => {
        sections.push(`${envVar}=your_${integration.name.toLowerCase().replace(/\s+/g, "_")}_credential`);
      });
    });
    sections.push("```\n");
  }

  sections.push("### 4. Running Dev Environments\n");
  sections.push("```bash");
  sections.push(getRunCommand(repository));
  sections.push("```\n");

  sections.push("## 🔍 Troubleshooting Installation Issues\n");
  sections.push("### Port Collision\n");
  sections.push("If your port is in use, modify the run configuration environment:\n");
  sections.push("```bash");
  sections.push("PORT=5001 npm run dev");
  sections.push("```\n");

  sections.push("### Package Compilation Fails\n");
  sections.push("Verify that your node / programming runtime versions match the package manager requirements. Clear local locks and cache:\n");
  sections.push("```bash");
  sections.push("npm cache clean --force");
  sections.push("rm -rf node_modules package-lock.json");
  sections.push("npm install");
  sections.push("```\n");

  return sections.join("\n");
}

// ================================================================================
// INTEGRATIONS GUIDE GENERATION
// ================================================================================

function generateIntegrations(projectName: string, analysis: AdvancedAnalysis): string {
  if (analysis.externalIntegrations.length === 0) {
    return `# ${projectName} - Integrations\n\nNo external integrations configured.\n`;
  }

  const sections: string[] = [];

  sections.push(`# ${projectName} - Integration Credentials Guide\n`);

  sections.push("This document outlines credentials, sandboxing, and service dependencies for external APIs:\n");

  analysis.externalIntegrations.forEach((integration) => {
    sections.push(`\n## Service Provider: ${integration.name}\n`);
    sections.push(`**Integration Type:** \`${integration.type}\`\n`);
    sections.push(`**Description:** ${integration.description}\n`);

    if (integration.environmentVariables && integration.environmentVariables.length > 0) {
      sections.push("### Environment Configuration:\n");
      integration.environmentVariables.forEach((envVar) => {
        sections.push(`- \`${envVar}\` - Key credentials`);
      });
      sections.push("");
    }

    sections.push("### Credentials Setup Steps:\n");
    sections.push(`1. Head to the **${integration.name}** developer dashboard.`);
    sections.push("2. Generate sandbox/test api credentials.");
    sections.push(`3. Paste variables in \`.env\`.`);
    sections.push("4. Verify module loads cleanly on startup.\n");
  });

  return sections.join("\n");
}
