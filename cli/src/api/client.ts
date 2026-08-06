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

const FLAT_SQUARE_BADGES: Record<string, string> = {
  TypeScript: 'https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white',
  JavaScript: 'https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat-square&logo=javascript&logoColor=black',
  React: 'https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=white',
  'Next.js': 'https://img.shields.io/badge/Next.js-15.0-000000?style=flat-square&logo=next.js&logoColor=white',
  Express: 'https://img.shields.io/badge/Express-5.0-000000?style=flat-square&logo=express&logoColor=white',
  'Node.js': 'https://img.shields.io/badge/Node.js-20.0-339933?style=flat-square&logo=node.js&logoColor=white',
  Python: 'https://img.shields.io/badge/Python-3.11-3776ab?style=flat-square&logo=python&logoColor=white',
  Rust: 'https://img.shields.io/badge/Rust-1.80-000000?style=flat-square&logo=rust&logoColor=white',
  Go: 'https://img.shields.io/badge/Go-1.22-00add8?style=flat-square&logo=go&logoColor=white',
  Docker: 'https://img.shields.io/badge/Docker-24.0-2496ed?style=flat-square&logo=docker&logoColor=white',
  TailwindCSS: 'https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white',
  Prisma: 'https://img.shields.io/badge/Prisma-5.0-2d3748?style=flat-square&logo=prisma&logoColor=white',
  Vite: 'https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite&logoColor=white'
};

function generateFallbackReadme(snapshot: RepositorySnapshot, options: GenerateOptions): string {
  const pkg = (snapshot.packageManifests[0] as any) || {};
  const name = options.projectName || pkg.name || snapshot.repo;
  const version = pkg.version ? `v${pkg.version}` : 'v1.0.0';
  const license = pkg.license || 'MIT';

  // --- Derive real data from the scan ---
  const fileCount = snapshot.fileTree.length;
  const folders = new Set<string>();
  const extensions = new Map<string, number>();
  snapshot.fileTree.forEach((f) => {
    const parts = f.split('/');
    if (parts.length > 1) folders.add(parts[0]);
    const ext = f.includes('.') ? '.' + f.split('.').pop()! : '';
    if (ext) extensions.set(ext, (extensions.get(ext) || 0) + 1);
  });
  const topExtensions = [...extensions.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([ext, count]) => `\`${ext}\` (${count})`)
    .join(', ');

  // Description — use real data
  const description = pkg.description ||
    `${name} is a ${snapshot.detectedStack.slice(0, 3).join('/') || 'software'} project containing ${fileCount} source files across ${folders.size} directories.`;

  // Badges
  const techBadges = snapshot.detectedStack
    .map((tech) => {
      const badgeUrl = FLAT_SQUARE_BADGES[tech] || `https://img.shields.io/badge/-${encodeURIComponent(tech)}-4f46e5?style=flat-square`;
      return `<img src="${badgeUrl}" alt="${tech}" />`;
    })
    .join(' ');

  // Directory tree (show up to 40 files with proper nesting)
  const treeLines: string[] = [];
  const shownFiles = snapshot.fileTree.slice(0, 40);
  shownFiles.forEach((f, i) => {
    const connector = i === shownFiles.length - 1 && snapshot.fileTree.length <= 40 ? '└──' : '├──';
    treeLines.push(`${connector} ${f}`);
  });
  if (snapshot.fileTree.length > 40) {
    treeLines.push(`└── ... (${snapshot.fileTree.length - 40} more files)`);
  }
  const topTree = treeLines.join('\n');

  // Directory table
  const directoryRows = generateDirectoryTableRows(snapshot.fileTree);

  // Tech Matrix
  const techMatrixRows = snapshot.detectedStack
    .filter((t) => TECH_CATEGORIES[t])
    .map((t) => `| **${t}** | \`${TECH_CATEGORIES[t].category}\` | ${TECH_CATEGORIES[t].desc} |`)
    .join('\n');

  // Scripts table
  let scriptsSection = '';
  if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
    const rows = Object.entries(pkg.scripts)
      .map(([cmd, script]) => {
        const action = SCRIPT_DESCRIPTIONS[cmd.toLowerCase()] || `Runs: \`${script}\``;
        return `| \`npm run ${cmd}\` | \`${script}\` | ${action} |`;
      })
      .join('\n');
    scriptsSection = `## 📜 Available Scripts

| Command | Script | What it does |
| :--- | :--- | :--- |
${rows}

---

`;
  }

  // Dependencies section — list actual deps from package.json
  let depsSection = '';
  if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
    const depEntries = Object.entries(pkg.dependencies as Record<string, string>);
    const depRows = depEntries.slice(0, 20).map(([dep, ver]) => `| \`${dep}\` | \`${ver}\` |`).join('\n');
    depsSection = `## 📦 Dependencies

| Package | Version |
| :--- | :--- |
${depRows}
${depEntries.length > 20 ? `\n*... and ${depEntries.length - 20} more. See [\`package.json\`](./package.json) for the full list.*\n` : ''}
`;
    if (pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0) {
      const devEntries = Object.entries(pkg.devDependencies as Record<string, string>);
      const devRows = devEntries.slice(0, 10).map(([dep, ver]) => `| \`${dep}\` | \`${ver}\` |`).join('\n');
      depsSection += `
### Dev Dependencies

| Package | Version |
| :--- | :--- |
${devRows}
${devEntries.length > 10 ? `\n*... and ${devEntries.length - 10} more.*\n` : ''}
`;
    }
    depsSection += '\n---\n\n';
  }

  // Features — derived from actual scan data, not hardcoded
  const features: string[] = [];
  if (folders.size >= 3) features.push(`- 📁 **${folders.size} Organized Modules** — code is split across \`${[...folders].slice(0, 4).join('/\`, \`')}/\` and more, keeping concerns separated.`);
  if (snapshot.detectedStack.includes('TypeScript')) features.push('- 🛡️ **TypeScript** — full static typing across the codebase for compile-time safety and editor autocomplete.');
  if (snapshot.detectedStack.includes('React') || snapshot.detectedStack.includes('Vue') || snapshot.detectedStack.includes('Angular')) features.push(`- ⚛️ **${snapshot.detectedStack.find(s => ['React','Vue','Angular'].includes(s))} Frontend** — component-based UI with reactive state management.`);
  if (snapshot.detectedStack.includes('Express') || snapshot.detectedStack.includes('Fastify')) features.push('- 🌐 **REST API Backend** — Express/Fastify server with route handlers and middleware.');
  if (snapshot.detectedStack.includes('Docker')) features.push('- 🐳 **Docker** — containerized for consistent dev/prod environments.');
  if (snapshot.detectedStack.includes('TailwindCSS')) features.push('- 🎨 **TailwindCSS** — utility-first CSS framework for rapid UI development.');
  if (snapshot.detectedStack.includes('Prisma')) features.push('- 🗄️ **Prisma ORM** — type-safe database access with auto-generated client.');
  if (pkg.scripts?.test || pkg.scripts?.['test:unit']) features.push('- 🧪 **Test Suite** — automated tests configured via `npm test`.');
  if (pkg.scripts?.lint || pkg.scripts?.format) features.push('- ✨ **Linting & Formatting** — code quality enforced with linter/formatter scripts.');
  if (features.length === 0) {
    features.push(`- 📄 **${fileCount} Source Files** — organized across ${folders.size} directories.`);
    features.push(`- 🔧 **File Types** — ${topExtensions || 'various source files'}.`);
  }

  // Env vars — try to detect from actual .env files or common patterns
  const envVars: string[] = [];
  snapshot.files.forEach((f) => {
    if (f.path.includes('.env.example') || f.path.includes('.env.sample')) {
      f.content.split('\n').forEach((line) => {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
        if (match) envVars.push(match[1]);
      });
    }
  });
  let envSection: string;
  if (envVars.length > 0) {
    const envRows = [...new Set(envVars)].slice(0, 12).map((v) => `| \`${v}\` | — | See \`.env.example\` |`).join('\n');
    envSection = `## 🔧 Environment Variables

Variables detected from \`.env.example\`:

| Variable | Default | Description |
| :--- | :--- | :--- |
${envRows}

Copy the example file and fill in your values:

\\\`\\\`\\\`bash
cp .env.example .env
\\\`\\\`\\\``;
  } else {
    envSection = `## 🔧 Configuration

If the project uses environment variables, create a \`.env\` file in the project root:

\\\`\\\`\\\`bash
cp .env.example .env
\\\`\\\`\\\`

Edit the file and fill in any required values (API keys, database URLs, etc.).`;
  }

  // Prerequisites — only list what's actually detected
  const prereqs: string[] = [];
  if (snapshot.detectedStack.includes('Node.js')) prereqs.push('- **Node.js** v18+ and **npm** (or yarn/pnpm)');
  if (snapshot.detectedStack.includes('Python')) prereqs.push('- **Python** 3.9+');
  if (snapshot.detectedStack.includes('Rust')) prereqs.push('- **Rust** (latest stable via `rustup`)');
  if (snapshot.detectedStack.includes('Go')) prereqs.push('- **Go** 1.20+');
  if (snapshot.detectedStack.includes('Docker')) prereqs.push('- **Docker** and **Docker Compose**');
  prereqs.push('- **Git**');

  // Install steps — derive from actual scripts
  const installCmd = snapshot.detectedStack.includes('Node.js') ? 'npm install' :
    snapshot.detectedStack.includes('Python') ? 'pip install -r requirements.txt' :
    snapshot.detectedStack.includes('Rust') ? 'cargo build' :
    snapshot.detectedStack.includes('Go') ? 'go mod download' : '# Install dependencies';
  const devCmd = pkg.scripts?.dev ? 'npm run dev' :
    pkg.scripts?.start ? 'npm start' :
    snapshot.detectedStack.includes('Python') ? 'python main.py' : '# Start the application';
  const buildCmd = pkg.scripts?.build ? 'npm run build' : '# Build for production';

  // Troubleshooting — more entries, based on stack
  const faqEntries: string[] = [];
  if (snapshot.detectedStack.includes('Node.js')) {
    faqEntries.push(`<details>
<summary><strong>npm install fails or modules are missing</strong></summary>
<br>
Delete <code>node_modules</code> and the lockfile, then reinstall:

\\\`\\\`\\\`bash
rm -rf node_modules package-lock.json
npm install
\\\`\\\`\\\`

Make sure you are on Node.js v18 or higher: <code>node --version</code>.
</details>`);
  }
  if (pkg.scripts?.dev || pkg.scripts?.start) {
    faqEntries.push(`<details>
<summary><strong>Port already in use</strong></summary>
<br>
Another process is using the same port. Either stop it or change the port in your <code>.env</code> file.
</details>`);
  }
  if (snapshot.detectedStack.includes('TypeScript')) {
    faqEntries.push(`<details>
<summary><strong>TypeScript errors after pulling new changes</strong></summary>
<br>
Run <code>npm install</code> to pick up any new dependencies, then <code>npx tsc --noEmit</code> to check types.
</details>`);
  }
  faqEntries.push(`<details>
<summary><strong>Environment variables not loading</strong></summary>
<br>
Make sure you have a <code>.env</code> file in the project root. Copy from <code>.env.example</code> if available.
</details>`);

  return `<p align="center">
  <img src="https://img.icons8.com/fluency/96/markdown.png" alt="${name}" width="80" />
</p>

<h1 align="center">${name}</h1>

<p align="center">
  <strong>${description}</strong>
</p>

<br />

<p align="center">
  <a href="#-overview"><img src="https://img.shields.io/badge/📖_Overview-4f46e5?style=for-the-badge" alt="Overview" /></a>&nbsp;
  <a href="#-key-features"><img src="https://img.shields.io/badge/✨_Features-0891b2?style=for-the-badge" alt="Features" /></a>&nbsp;
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/⚙️_Tech_Stack-059669?style=for-the-badge" alt="Tech Stack" /></a>&nbsp;
  <a href="#-getting-started"><img src="https://img.shields.io/badge/🚀_Get_Started-dc2626?style=for-the-badge" alt="Get Started" /></a>&nbsp;
  <a href="#-project-structure"><img src="https://img.shields.io/badge/📂_Structure-ca8a04?style=for-the-badge" alt="Structure" /></a>&nbsp;
  <a href="#-contributing"><img src="https://img.shields.io/badge/🤝_Contribute-7c3aed?style=for-the-badge" alt="Contribute" /></a>
</p>

<br />

<p align="center">
  ${techBadges}
  <img src="https://img.shields.io/badge/Version-${encodeURIComponent(version)}-3178c6?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/License-${encodeURIComponent(license)}-22c55e?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**${name}** contains **${fileCount} files** across **${folders.size} directories**, built with ${snapshot.detectedStack.join(', ') || 'standard tooling'}.${pkg.description ? ' ' + pkg.description : ''} The most common file types are ${topExtensions || 'source files'}.

${options.instructions ? `> 💡 ${options.instructions}\n` : ''}
---

## ✨ Key Features

${features.join('\n')}

---

## ⚙️ Tech Stack

| Technology | Category | Role |
| :--- | :--- | :--- |
${techMatrixRows || '| *No specific frameworks detected* | — | — |'}

---

## 📂 Project Structure

\\\`\\\`\\\`text
${name}/
${topTree}
\\\`\\\`\\\`

| Directory | Purpose |
| :--- | :--- |
${directoryRows}

---

${scriptsSection}${depsSection}## 🚀 Getting Started

### Prerequisites

${prereqs.join('\n')}

### Setup

1. **Clone the repo**
   \\\`\\\`\\\`bash
   git clone <repository-url>
   cd ${name}
   \\\`\\\`\\\`

2. **Install dependencies**
   \\\`\\\`\\\`bash
   ${installCmd}
   \\\`\\\`\\\`

3. **Set up environment** (if applicable)
   \\\`\\\`\\\`bash
   cp .env.example .env
   # Edit .env with your values
   \\\`\\\`\\\`

4. **Run in development**
   \\\`\\\`\\\`bash
   ${devCmd}
   \\\`\\\`\\\`

5. **Build for production**
   \\\`\\\`\\\`bash
   ${buildCmd}
   \\\`\\\`\\\`

---

${envSection}

---
${pkg.scripts?.test || pkg.scripts?.lint ? `
## 🧪 Testing & Quality

\\\`\\\`\\\`bash${pkg.scripts?.test ? '\n# Run tests\nnpm test' : ''}${pkg.scripts?.lint ? '\n\n# Lint code\nnpm run lint' : ''}${pkg.scripts?.typecheck ? '\n\n# Type check\nnpm run typecheck' : ''}
\\\`\\\`\\\`

---
` : ''}
## ❓ Troubleshooting

${faqEntries.join('\n\n')}

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (\\\`git checkout -b feature/my-feature\\\`)
3. Commit changes (\\\`git commit -m "Add my feature"\\\`)
4. Push (\\\`git push origin feature/my-feature\\\`)
5. Open a Pull Request

---

## 📄 License

${license} — see [\`LICENSE\`](./LICENSE) for details.

---

<p align="center">
  <sub>Generated with <a href="https://github.com/ApurveKaranwal/mdfmt">mdfmt</a></sub>
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
