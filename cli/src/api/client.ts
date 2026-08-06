import http from 'http';
import https from 'https';
import { URL } from 'url';
import { RepositorySnapshot } from '../scanner/localScanner';

export interface GenerateOptions {
  projectName?: string;
  groqApiKey?: string;
  instructions?: string;
  documentationDepth?: 'readme-only' | 'standard' | 'complete';
  serverUrl?: string;
  offline?: boolean;
}

export interface GeneratedResult {
  readme: string;
  docs?: { path: string; title: string; content: string }[];
  summary: string;
  creatorQuestions?: string[];
  isFallback?: boolean;
}

export async function generateReadme(
  snapshot: RepositorySnapshot,
  options: GenerateOptions
): Promise<GeneratedResult> {
  // If explicitly in offline mode, skip server attempt immediately
  if (!options.offline) {
    const targetServer = options.serverUrl || process.env.MDFMT_SERVER_URL || 'http://localhost:5000';
    const endpoint = `${targetServer.replace(/\/$/, '')}/api/v1/cli/generate-local`;

    try {
      const payload = JSON.stringify({
        repository: snapshot,
        projectName: options.projectName || snapshot.repo,
        groqApiKey: options.groqApiKey || process.env.GROQ_API_KEY,
        instructions: options.instructions,
        documentationDepth: options.documentationDepth || 'standard'
      });

      const responseText = await postJson(endpoint, payload);
      const parsed = JSON.parse(responseText);

      if (parsed && parsed.result && parsed.result.readme) {
        return {
          readme: parsed.result.readme,
          docs: parsed.result.docs,
          summary: parsed.result.summary || 'Generated via mdfmt AI Service',
          creatorQuestions: parsed.result.creatorQuestions
        };
      }
    } catch {
      // Silently fallback to local engine when server is unreachable or offline
    }
  }

  // Fast standalone offline generator fallback
  const fallbackReadme = generateFallbackReadme(snapshot, options);
  return {
    readme: fallbackReadme,
    summary: 'Generated offline using local template engine',
    isFallback: true
  };
}

function postJson(urlStr: string, jsonPayload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonPayload),
        'User-Agent': 'mdfmt-cli/1.0.0'
      },
      timeout: 3000
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Server responded with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(jsonPayload);
    req.end();
  });
}

const TECH_CATEGORIES: Record<string, { category: string; desc: string }> = {
  TypeScript: { category: 'Language', desc: 'Static typing, interface definitions, and IDE intellisense ergonomics.' },
  JavaScript: { category: 'Language', desc: 'Core execution runtime and dynamic application logic.' },
  React: { category: 'Frontend UI', desc: 'Component-based reactive UI rendering and state hooks.' },
  'Next.js': { category: 'Full-Stack Framework', desc: 'Hybrid SSR/SSG rendering, file-system routing, and server actions.' },
  Express: { category: 'Backend API Framework', desc: 'RESTful API routing, middleware chains, and HTTP request handling.' },
  'Node.js': { category: 'Runtime', desc: 'Non-blocking asynchronous event loop server environment.' },
  Python: { category: 'Language / Backend', desc: 'Clean scripting, data manipulation, and backend service processing.' },
  Rust: { category: 'System Language', desc: 'High-speed compiled execution with zero-cost memory abstractions.' },
  Go: { category: 'Backend / Systems', desc: 'Native lightweight goroutine concurrency and microservice binary distribution.' },
  Docker: { category: 'DevOps / Containerization', desc: 'Isolated application containerization and reproducible deployment builds.' },
  TailwindCSS: { category: 'Styling', desc: 'Utility-first responsive design tokens and modern visual styling.' },
  Prisma: { category: 'Database ORM', desc: 'Type-safe SQL queries, relational schema migrations, and modeling.' },
  Vite: { category: 'Build Tool / Bundler', desc: 'Instant ESM dev server and optimized production asset bundling.' }
};

const FOLDER_PURPOSES: Record<string, string> = {
  src: 'Primary application source code repository.',
  bin: 'Executable binary CLI wrappers and entrypoint scripts.',
  components: 'Reusable UI elements, layout wrappers, and atomic interface controls.',
  routes: 'API endpoints, HTTP request controllers, and route handlers.',
  services: 'Business logic layers, external API integrations, and data processing.',
  utils: 'Helper functions, string formatters, and shared utility abstractions.',
  types: 'TypeScript interface definitions, type guards, and shared contracts.',
  pages: 'Page views, screen layouts, and application route views.',
  store: 'Global client state management stores and context providers.',
  models: 'Data models, database entities, and validation schemas.',
  public: 'Static public assets (images, icons, manifest files).',
  prisma: 'Database ORM schema definitions and migration scripts.',
  docs: 'Project documentation, guides, and architectural design files.',
  tests: 'Automated unit, integration, and end-to-end test suites.',
  config: 'Environment configuration profiles and application settings.'
};

const SCRIPT_DESCRIPTIONS: Record<string, string> = {
  dev: 'Launches local development environment with hot-reloading.',
  build: 'Compiles source files into optimized production-ready bundle.',
  start: 'Starts the production server instance.',
  test: 'Executes automated unit and integration test suites.',
  typecheck: 'Runs TypeScript compiler type checking without emitting files.',
  lint: 'Scans codebase for syntax formatting and code style compliance.',
  format: 'Auto-formats source code files according to project standards.'
};

function generateFallbackReadme(snapshot: RepositorySnapshot, options: GenerateOptions): string {
  const pkg = (snapshot.packageManifests[0] as any) || {};
  const name = options.projectName || pkg.name || snapshot.repo;
  const description =
    pkg.description ||
    `A high-performance, modular software application built with ${
      snapshot.detectedStack.join(', ') || 'clean architectural patterns'
    }. Built for production reliability, developer clarity, and scalable maintenance.`;
  const version = pkg.version ? `v${pkg.version}` : 'v1.0.0';
  const license = pkg.license || 'MIT';

  // Badges
  const badges = [
    `![Version](https://img.shields.io/badge/version-${encodeURIComponent(version)}-blue.svg?style=flat-square)`,
    `![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-22c55e.svg?style=flat-square)`,
    ...snapshot.detectedStack.map(
      (tech) => `![${tech}](https://img.shields.io/badge/-${encodeURIComponent(tech)}-4f46e5?style=flat-square)`
    )
  ].join(' ');

  // Directory Tree & Guide
  const topTree = snapshot.fileTree.slice(0, 20).map((f) => `├── ${f}`).join('\n');
  const directoryRows = generateDirectoryTableRows(snapshot.fileTree);

  // Tech Matrix Table
  const techMatrixRows = snapshot.detectedStack
    .filter((t) => TECH_CATEGORIES[t])
    .map((t) => `| **${t}** | \`${TECH_CATEGORIES[t].category}\` | ${TECH_CATEGORIES[t].desc} |`)
    .join('\n');

  // Scripts table if package.json has scripts
  let scriptsSection = '';
  if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
    const rows = Object.entries(pkg.scripts)
      .map(([cmd, script]) => {
        const action = SCRIPT_DESCRIPTIONS[cmd.toLowerCase()] || `Executes script: \`${script}\``;
        return `| \`npm run ${cmd}\` | \`${script}\` | ${action} |`;
      })
      .join('\n');
    scriptsSection = `## 📜 Available Scripts Reference

| Command | Executed Command | Description |
| :--- | :--- | :--- |
${rows}

---

`;
  }

  return `<p align="center">
  <h1 align="center">${name}</h1>
</p>

<p align="center">
  <em>${description}</em>
</p>

<p align="center">
  ${badges}
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Key Technical Features](#-key-technical-features)
- [⚙️ Tech Stack Architecture](#️-tech-stack-architecture)
- [📂 Directory Structure & Module Guide](#-directory-structure--module-guide)
${scriptsSection ? '- [📜 Available Scripts Reference](#-available-scripts-reference)\n' : ''}- [🚀 Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
- [🔧 Configuration & Environment Variables](#-configuration--environment-variables)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [❓ Troubleshooting & FAQ](#-troubleshooting--faq)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 Overview

**${name}** is engineered to deliver a structured, scalable, and maintainable codebase. It decouples business logic from presentation layers, enforcing clean software design principles across modules.

${options.instructions ? `\n> 💡 **Developer Focus & Instructions**: ${options.instructions}\n` : ''}

---

## ✨ Key Technical Features

- 🧩 **Modular Architecture**: Decoupled folder structure allowing seamless scalability and component reusability.
- 🔒 **Privacy & Secret Redaction**: Native sanitization rules preventing accidental credential or environment token leaks.
- ⚡ **Optimized Developer Workflow**: Pre-configured scripts for local development, hot-reloading, typechecking, and production builds.
${snapshot.detectedStack.includes('TypeScript') ? '- 🛡️ **End-to-End Type Safety**: Complete TypeScript definitions ensuring compile-time bug prevention.\n' : ''}${snapshot.detectedStack.includes('Docker') ? '- 🐳 **Containerized Workflows**: Docker container configs for consistent development and deployment.\n' : ''}

---

## ⚙️ Tech Stack Architecture

| Technology | Category | Role in Repository |
| :--- | :--- | :--- |
${techMatrixRows || '| **Node.js** | `Runtime` | Application execution environment. |'}

---

## 📂 Directory Structure & Module Guide

\`\`\`text
${name}/
${topTree}
${snapshot.fileTree.length > 20 ? `└── ... (${snapshot.fileTree.length - 20} additional files)` : ''}
\`\`\`

### Directory Breakdown

| Directory / File | Description & Purpose |
| :--- | :--- |
${directoryRows}

---

${scriptsSection}## 🚀 Getting Started & Installation

### Prerequisites

Ensure your environment meets the following software requirements before proceeding:
${snapshot.detectedStack.includes('Node.js') ? '- **Node.js**: v18.0.0 or higher\n- **Package Manager**: npm (v9+), yarn, or pnpm' : ''}
${snapshot.detectedStack.includes('Python') ? '- **Python**: v3.9 or higher' : ''}
${snapshot.detectedStack.includes('Rust') ? '- **Rust / Cargo**: latest stable' : ''}
${snapshot.detectedStack.includes('Go') ? '- **Go**: v1.20 or higher' : ''}
- **Git**: v2.25+

### Step-by-Step Setup

1. **Clone the Repository**:
   \`\`\`bash
   git clone <repository-url>
   cd ${name}
   \`\`\`

2. **Install Project Dependencies**:
   \`\`\`bash
   ${snapshot.detectedStack.includes('Node.js') ? 'npm install' : '# Install dependencies'}
   \`\`\`

3. **Configure Environment Variables**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Start Development Environment**:
   \`\`\`bash
   ${pkg.scripts?.dev ? 'npm run dev' : pkg.scripts?.start ? 'npm start' : '# Run application'}
   \`\`\`

5. **Build for Production**:
   \`\`\`bash
   ${pkg.scripts?.build ? 'npm run build' : '# Compile production build'}
   \`\`\`

---

## 🔧 Configuration & Environment Variables

Configure application settings in your local \`.env\` file:

| Variable | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`PORT\` | Number | No | \`5000\` | HTTP server listening port |
| \`NODE_ENV\` | String | No | \`development\` | Application runtime environment (\`development\` / \`production\`) |
| \`DATABASE_URL\` | String | Optional | - | Relational or document database connection string |

---

## 🧪 Testing & Quality Assurance

Run type checking and linting standards to verify code quality:

\`\`\`bash
# Type check TypeScript definitions
${pkg.scripts?.typecheck ? 'npm run typecheck' : 'npx tsc --noEmit'}

# Run code linter
${pkg.scripts?.lint ? 'npm run lint' : 'npm test'}
\`\`\`

---

## ❓ Troubleshooting & FAQ

<details>
<summary><strong>Q: Server fails to start due to port binding errors?</strong></summary>
<br>
<strong>A:</strong> Ensure port <code>5000</code> (or your custom <code>PORT</code> variable in <code>.env</code>) is not being used by another process. Kill conflicting processes or update <code>PORT=5001</code> in <code>.env</code>.
</details>

<details>
<summary><strong>Q: TypeScript compilation or missing module errors?</strong></summary>
<br>
<strong>A:</strong> Delete your <code>node_modules</code> directory and lockfile, then re-run <code>npm install</code>. Ensure Node.js version is <code>v18+</code>.
</details>

---

## 🤝 Contributing

We welcome community contributions! Please follow these guidelines:

1. Fork the Repository
2. Create a Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request for code review

---

## 📄 License

Distributed under the **${license}** License.

---

<p align="center">
  <sub>Generated with ❤️ using <a href="https://github.com/ApurveKaranwal/mdfmt">mdfmt — README Studio</a></sub>
</p>
`;
}

function generateDirectoryTableRows(fileTree: string[]): string {
  const detectedFolders = new Set<string>();

  fileTree.forEach((file) => {
    const parts = file.split('/');
    if (parts.length > 1) {
      detectedFolders.add(parts[0]);
    }
  });

  const rows: string[] = [];
  detectedFolders.forEach((folder) => {
    const purpose = FOLDER_PURPOSES[folder.toLowerCase()] || 'Application module directory.';
    rows.push(`| \`${folder}/\` | ${purpose} |`);
  });

  if (rows.length === 0) {
    rows.push('| `src/` | Main application source code. |');
  }

  return rows.join('\n');
}
