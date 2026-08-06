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

function analyzeCodebase(snapshot: any, pkg: any) {
  const analysis = {
    apiRoutes: [] as { method: string; path: string; file: string }[],
    components: [] as { name: string; file: string }[],
    exports: [] as { name: string; type: 'function' | 'class' | 'const'; file: string }[],
    envVars: [] as { name: string; file: string }[],
    dbModels: [] as { name: string; orm: string; file: string }[],
    middleware: [] as string[],
    hooks: [] as { name: string; file: string }[],
    configFiles: [] as { file: string; purpose: string }[],
    metrics: { locByLang: {} as Record<string, number>, totalLoc: 0 },
    entryPoints: [] as { file: string; bootstraps: string }[],
    thirdParty: new Set<string>(),
  };

  const thirdPartyRegexes: Record<string, RegExp> = {
    'Stripe': /['"]stripe['"]/,
    'SendGrid': /@sendgrid\/mail/,
    'Twilio': /['"]twilio['"]/,
    'Firebase': /firebase\//,
    'Supabase': /@supabase\/supabase-js/,
    'AWS SDK': /aws-sdk|@aws-sdk\//,
    'Google Cloud': /@google-cloud\//,
    'Redis': /['"]redis['"]|['"]ioredis['"]/,
    'Bull': /['"]bull['"]|['"]bullmq['"]/,
    'Socket.IO': /['"]socket\.io['"]|['"]socket\.io-client['"]/,
    'Passport': /['"]passport['"]/,
    'JWT': /['"]jsonwebtoken['"]/,
    'Bcrypt': /['"]bcrypt['"]|['"]bcryptjs['"]/,
    'Multer': /['"]multer['"]/,
    'Nodemailer': /['"]nodemailer['"]/,
  };

  const configDetectors: Record<string, string> = {
    'tsconfig': 'TypeScript compiler configuration',
    'eslint': 'ESLint linting rules',
    '.prettierrc': 'Prettier code formatting rules',
    'tailwind.config': 'Tailwind CSS design tokens and theme',
    'vite.config': 'Vite bundler configuration',
    'next.config': 'Next.js framework settings',
    'docker-compose': 'Docker multi-container orchestration',
    'Dockerfile': 'Docker image build instructions',
    'jest.config': 'Jest testing framework setup',
  };

  const entryPointNames = ['index.ts', 'index.js', 'main.ts', 'main.js', 'app.ts', 'app.js', 'server.ts', 'server.js'];
  if (pkg.main) entryPointNames.push(pkg.main.split('/').pop() || pkg.main);

  for (const file of (snapshot.files || [])) {
    if (!file.content) continue;
    const lines = file.content.split('\n');
    const ext = file.path.includes('.') ? '.' + file.path.split('.').pop()! : '';
    const isComponentFile = /\.(tsx|jsx|vue)$/.test(file.path);
    const fileName = file.path.split('/').pop() || file.path;

    // Metrics
    analysis.metrics.totalLoc += lines.length;
    if (ext) {
      analysis.metrics.locByLang[ext] = (analysis.metrics.locByLang[ext] || 0) + lines.length;
    }

    // Config files
    for (const [key, purpose] of Object.entries(configDetectors)) {
      if (fileName.includes(key)) {
        analysis.configFiles.push({ file: file.path, purpose });
        break;
      }
    }
    if (file.path.includes('.github/workflows/')) {
      analysis.configFiles.push({ file: file.path, purpose: 'GitHub Actions CI/CD pipeline' });
    }

    // Entry points
    if (entryPointNames.includes(fileName) || file.path.includes('bin/')) {
      const firstFew = lines.slice(0, 10).join('\n');
      let bootstraps = 'Entry point / bootstrap script';
      if (firstFew.includes('express()') || firstFew.includes('app.listen')) bootstraps = 'Express server initialization';
      else if (firstFew.includes('createRoot') || firstFew.includes('ReactDOM')) bootstraps = 'React application mount';
      else if (firstFew.includes('createApp')) bootstraps = 'Vue application mount';
      else if (firstFew.includes('NestFactory.create')) bootstraps = 'NestJS application bootstrap';
      analysis.entryPoints.push({ file: file.path, bootstraps });
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // API Routes
      const routeMatch = line.match(/(?:app|router)\.(get|post|put|delete|patch)\(['"`](\/?[^'"`]+)['"`]/);
      if (routeMatch) {
        analysis.apiRoutes.push({ method: routeMatch[1].toUpperCase(), path: routeMatch[2], file: file.path });
      }

      // Middleware
      if (line.match(/(?:app|router)\.use\(/)) {
        analysis.middleware.push(line.trim());
      }
      
      // Hooks
      const hookMatch = line.match(/function (use[A-Z][a-zA-Z0-9_]*)/);
      if (hookMatch) {
        analysis.hooks.push({ name: hookMatch[1], file: file.path });
      }

      // Third-party
      for (const [tp, regex] of Object.entries(thirdPartyRegexes)) {
        if (regex.test(line)) analysis.thirdParty.add(tp);
      }

      // Env vars
      const envMatch = line.match(/(?:process\.env\.|import\.meta\.env\.)([A-Z_][A-Z0-9_]*)/);
      if (envMatch) {
        analysis.envVars.push({ name: envMatch[1], file: file.path });
      }
      if (file.path.includes('.env.example') || file.path.includes('.env.sample')) {
        const dotenvMatch = line.match(/^([A-Z_][A-Z0-9_]*)=/);
        if (dotenvMatch) {
          analysis.envVars.push({ name: dotenvMatch[1], file: file.path });
        }
      }

      // Components
      if (isComponentFile) {
        let compName = '';
        const exportDefFunc = line.match(/export default function ([A-Z][a-zA-Z0-9_]*)/);
        const exportFunc = line.match(/export function ([A-Z][a-zA-Z0-9_]*)/);
        const exportConst = line.match(/export const ([A-Z][a-zA-Z0-9_]*)\s*=/);
        const constFc = line.match(/const ([A-Z][a-zA-Z0-9_]*)\s*:\s*React\.FC/);
        const exportDefClass = line.match(/export default class ([A-Z][a-zA-Z0-9_]*)/);

        if (exportDefFunc) compName = exportDefFunc[1];
        else if (exportFunc) compName = exportFunc[1];
        else if (exportConst) compName = exportConst[1];
        else if (constFc) compName = constFc[1];
        else if (exportDefClass) compName = exportDefClass[1];

        if (compName) analysis.components.push({ name: compName, file: file.path });
      } else {
        // Exports
        let expName = '';
        let expType: 'function' | 'class' | 'const' = 'function';
        
        const expFuncMatch = line.match(/export function ([a-zA-Z0-9_]+)/);
        const expClassMatch = line.match(/export class ([a-zA-Z0-9_]+)/);
        const expConstMatch = line.match(/export const ([a-zA-Z0-9_]+)\s*=/);
        const expDefaultFuncMatch = line.match(/export default function\s+([a-zA-Z0-9_]+)/);
        const moduleExportsMatch = line.match(/module\.exports\s*=\s*([a-zA-Z0-9_]+)/);

        if (expFuncMatch) { expName = expFuncMatch[1]; expType = 'function'; }
        else if (expClassMatch) { expName = expClassMatch[1]; expType = 'class'; }
        else if (expConstMatch) { expName = expConstMatch[1]; expType = 'const'; }
        else if (expDefaultFuncMatch) { expName = expDefaultFuncMatch[1]; expType = 'function'; }
        else if (moduleExportsMatch) { expName = moduleExportsMatch[1]; expType = 'const'; }

        if (expName) analysis.exports.push({ name: expName, type: expType, file: file.path });
      }

      // DB Models
      if (file.path.endsWith('.prisma') && line.match(/model\s+([A-Z][a-zA-Z0-9_]*)\s+{/)) {
        analysis.dbModels.push({ name: line.match(/model\s+([A-Z][a-zA-Z0-9_]*)\s+{/)![1], orm: 'Prisma', file: file.path });
      }
      if (line.match(/new\s+Schema\(/) || line.match(/mongoose\.model\(/)) {
        analysis.dbModels.push({ name: 'Mongoose Model', orm: 'Mongoose', file: file.path });
      }
      if (line.match(/@Entity\(\)/) || line.match(/class ([A-Z][a-zA-Z0-9_]*)\s+extends\s+Model/)) {
        analysis.dbModels.push({ name: 'Entity', orm: line.match(/@Entity\(\)/) ? 'TypeORM' : 'Sequelize', file: file.path });
      }
      if (line.match(/sequelize\.define\(/)) {
        analysis.dbModels.push({ name: 'Sequelize Model', orm: 'Sequelize', file: file.path });
      }
      if (file.path.endsWith('.sql') && line.toLowerCase().includes('create table')) {
         const sqlMatch = line.match(/create table (?:if not exists )?([a-zA-Z0-9_]+)/i);
         if (sqlMatch) analysis.dbModels.push({ name: sqlMatch[1], orm: 'SQL', file: file.path });
      }
    }
  }

  const uniqueEnvVars = Array.from(new Set(analysis.envVars.map(v => JSON.stringify(v)))).map(s => JSON.parse(s));
  const uniqueApiRoutes = Array.from(new Set(analysis.apiRoutes.map(r => JSON.stringify(r)))).map(s => JSON.parse(s));
  const uniqueComponents = Array.from(new Set(analysis.components.map(c => JSON.stringify(c)))).map(s => JSON.parse(s));
  const uniqueExports = Array.from(new Set(analysis.exports.map(e => JSON.stringify(e)))).map(s => JSON.parse(s));
  
  return {
    ...analysis,
    envVars: uniqueEnvVars,
    apiRoutes: uniqueApiRoutes,
    components: uniqueComponents,
    exports: uniqueExports,
    thirdPartyArray: Array.from(analysis.thirdParty)
  };
}

function generateFallbackReadme(snapshot: RepositorySnapshot, options: GenerateOptions): string {
  const pkg: any = (snapshot.packageManifests && snapshot.packageManifests[0]) || {};
  const name = options.projectName || pkg.name || snapshot.repo || 'Project';
  const version = pkg.version ? `v${pkg.version}` : 'v1.0.0';
  const license = pkg.license || 'MIT';

  // --- Codebase Analysis ---
  const analysis = analyzeCodebase(snapshot as any, pkg);

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

  const hasFrontend = folders.has('components') || folders.has('pages') || snapshot.detectedStack.includes('React') || snapshot.detectedStack.includes('Vue');
  const hasBackend = folders.has('routes') || folders.has('models') || snapshot.detectedStack.includes('Express') || snapshot.detectedStack.includes('Fastify');
  
  let architecture = '';
  if (hasFrontend && hasBackend) {
    architecture = 'This project appears to be a **Full-stack Monorepo / Client-Server** application.';
  } else if (hasFrontend) {
    architecture = 'This project appears to be a **Frontend Client** application.';
  } else if (hasBackend) {
    architecture = 'This project appears to be a **Backend API / Service** application.';
  } else {
    architecture = 'This project is a modular software repository.';
  }

  // Description
  const description = pkg.description ||
    `${name} is a ${snapshot.detectedStack.slice(0, 3).join('/') || 'software'} project.`;

  // Badges
  const techBadges = snapshot.detectedStack
    .map((tech) => {
      const badgeUrl = FLAT_SQUARE_BADGES[tech] || `https://img.shields.io/badge/-${encodeURIComponent(tech)}-4f46e5?style=flat-square`;
      return `<img src="${badgeUrl}" alt="${tech}" />`;
    })
    .join(' ');

  // Directory tree
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

  // Components per directory text
  let projectStructureExtra = '';
  if (analysis.components.length > 0) {
     projectStructureExtra = `\nFound **${analysis.components.length} UI components** across the directories.\n`;
  }

  // Tech Matrix
  let techMatrixRows = snapshot.detectedStack
    .filter((t) => TECH_CATEGORIES[t])
    .map((t) => `| **${t}** | \`${TECH_CATEGORIES[t].category}\` | ${TECH_CATEGORIES[t].desc} |`)
    .join('\n');
    
  if (analysis.thirdPartyArray.length > 0) {
    analysis.thirdPartyArray.forEach(tp => {
      techMatrixRows += `\n| **${tp}** | \`Third-party Service\` | External integration detected in imports. |`;
    });
  }

  // Features
  const features: string[] = [];
  if (analysis.apiRoutes.length > 0) features.push(`- 🌐 **API Endpoints** — exposes ${analysis.apiRoutes.length} HTTP routes.`);
  if (analysis.components.length > 0) features.push(`- ⚛️ **Component-based UI** — contains ${analysis.components.length} React/Vue components.`);
  if (analysis.dbModels.length > 0) features.push(`- 🗄️ **Database Schema** — defines ${analysis.dbModels.length} database models (${[...new Set(analysis.dbModels.map(m=>m.orm))].join(', ')}).`);
  if (analysis.thirdPartyArray.includes('Passport') || analysis.thirdPartyArray.includes('JWT')) features.push(`- 🔒 **Authentication** — handles secure user sessions/tokens.`);
  if (analysis.configFiles.some(c => c.file.includes('.github/workflows'))) features.push(`- 🚀 **CI/CD** — automated pipelines configured via GitHub Actions.`);
  if (snapshot.detectedStack.includes('Docker') || analysis.configFiles.some(c => c.file.includes('Docker'))) features.push(`- 🐳 **Dockerized** — deployment-ready container configuration.`);
  if (pkg.scripts?.test || pkg.scripts?.['test:unit']) features.push(`- 🧪 **Testing** — automated test suite included.`);
  
  if (features.length === 0) {
    features.push(`- 📁 **${folders.size} Modules** — organized codebase structure.`);
    features.push(`- 📄 **${fileCount} Source Files** — ready for development.`);
  }

  // API Reference
  let apiSection = '';
  if (analysis.apiRoutes.length > 0) {
    const routeRows = analysis.apiRoutes.map(r => `| \`${r.method}\` | \`${r.path}\` | \`${r.file}\` |`).join('\n');
    const table = analysis.apiRoutes.length > 10 ? `<details>\n<summary>View ${analysis.apiRoutes.length} API Routes</summary>\n\n| Method | Endpoint | File |\n| :--- | :--- | :--- |\n${routeRows}\n\n</details>` : `| Method | Endpoint | File |\n| :--- | :--- | :--- |\n${routeRows}`;
    apiSection = `## 📡 API Reference\n\n${table}\n\n---\n\n`;
  }

  // Database Schema
  let dbSection = '';
  if (analysis.dbModels.length > 0) {
    const dbRows = analysis.dbModels.map(m => `| \`${m.name}\` | ${m.orm} | \`${m.file}\` |`).join('\n');
    const table = analysis.dbModels.length > 10 ? `<details>\n<summary>View ${analysis.dbModels.length} Database Models</summary>\n\n| Model | ORM | File |\n| :--- | :--- | :--- |\n${dbRows}\n\n</details>` : `| Model | ORM | File |\n| :--- | :--- | :--- |\n${dbRows}`;
    dbSection = `## 🗄️ Database Schema\n\n${table}\n\n---\n\n`;
  }

  // Components
  let compSection = '';
  if (analysis.components.length > 0) {
    const compRows = analysis.components.map(c => `| \`${c.name}\` | \`${c.file}\` |`).join('\n');
    const table = analysis.components.length > 10 ? `<details>\n<summary>View ${analysis.components.length} UI Components</summary>\n\n| Component | File |\n| :--- | :--- |\n${compRows}\n\n</details>` : `| Component | File |\n| :--- | :--- |\n${compRows}`;
    compSection = `## 🧩 UI Components\n\n${table}\n\n---\n\n`;
  }

  // Exported Modules
  let expSection = '';
  if (analysis.exports.length > 0) {
    const expRows = analysis.exports.slice(0, 20).map(e => `| \`${e.name}\` | \`${e.type}\` | \`${e.file}\` |`).join('\n');
    const table = analysis.exports.length > 10 ? `<details>\n<summary>View Key Exports</summary>\n\n| Name | Type | File |\n| :--- | :--- | :--- |\n${expRows}\n\n</details>` : `| Name | Type | File |\n| :--- | :--- | :--- |\n${expRows}`;
    expSection = `## 📦 Exported Modules\n\n${table}\n\n---\n\n`;
  }

  // Config Files
  let configSection = '';
  if (analysis.configFiles.length > 0) {
    const confRows = analysis.configFiles.map(c => `| \`${c.file}\` | ${c.purpose} |`).join('\n');
    configSection = `## ⚙️ Configuration Files\n\n| File | Purpose |\n| :--- | :--- |\n${confRows}\n\n---\n\n`;
  }

  // CI/CD
  let cicdSection = '';
  const githubActions = analysis.configFiles.filter(c => c.file.includes('.github/workflows'));
  if (githubActions.length > 0) {
    cicdSection = `## 🚀 CI/CD Pipeline\n\nThis project uses GitHub Actions for continuous integration/deployment. Workflows detected:\n${githubActions.map(a => `- \`${a.file}\``).join('\n')}\n\n---\n\n`;
  }

  // Scripts table
  let scriptsSection = '';
  if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
    const rows = Object.entries(pkg.scripts)
      .map(([cmd, script]) => {
        const action = SCRIPT_DESCRIPTIONS[cmd.toLowerCase()] || `Runs: \`${script}\``;
        return `| \`npm run ${cmd}\` | \`${script}\` | ${action} |`;
      })
      .join('\n');
    scriptsSection = `## 📜 Scripts\n\n| Command | Script | What it does |\n| :--- | :--- | :--- |\n${rows}\n\n---\n\n`;
  }

  // Dependencies
  let depsSection = '';
  if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
    const categorizeDeps = (deps: Record<string, string>) => {
      const cats: Record<string, [string, string][]> = { HTTP: [], Database: [], Auth: [], UI: [], Utilities: [], Other: [] };
      Object.entries(deps).forEach(([dep, ver]) => {
        if (dep.includes('express') || dep.includes('axios') || dep.includes('fetch')) cats.HTTP.push([dep, ver]);
        else if (dep.includes('prisma') || dep.includes('mongoose') || dep.includes('pg') || dep.includes('sql')) cats.Database.push([dep, ver]);
        else if (dep.includes('passport') || dep.includes('jwt') || dep.includes('auth')) cats.Auth.push([dep, ver]);
        else if (dep.includes('react') || dep.includes('vue') || dep.includes('tailwind') || dep.includes('css')) cats.UI.push([dep, ver]);
        else if (dep.includes('lodash') || dep.includes('moment') || dep.includes('date-fns')) cats.Utilities.push([dep, ver]);
        else cats.Other.push([dep, ver]);
      });
      return cats;
    };
    
    const cats = categorizeDeps(pkg.dependencies);
    let depsMd = '';
    for (const [cat, items] of Object.entries(cats)) {
      if (items.length > 0) {
        depsMd += `**${cat}**\n${items.map(([dep, ver]) => `- \`${dep}\`: ${ver}`).join('\n')}\n\n`;
      }
    }
    
    depsSection = `## 📦 Dependencies\n\n${depsMd}---\n\n`;
  }

  // Env vars
  let envSection = '';
  if (analysis.envVars.length > 0) {
    const envRows = analysis.envVars.slice(0, 15).map((v) => `| \`${v.name}\` | \`${v.file}\` |`).join('\n');
    envSection = `## 🔧 Environment Variables\n\nDetected environment variable references:\n\n| Variable | File | \n| :--- | :--- |\n${envRows}\n\nCopy \`.env.example\` to \`.env\` and configure these values.\n\n---\n\n`;
  } else {
    envSection = `## 🔧 Configuration\n\nIf the project uses environment variables, create a \`.env\` file in the project root.\n\n---\n\n`;
  }

  // Prerequisites
  const prereqs: string[] = [];
  if (snapshot.detectedStack.includes('Node.js') || pkg.dependencies) prereqs.push('- **Node.js** v18+ and **npm** (or yarn/pnpm)');
  if (snapshot.detectedStack.includes('Python')) prereqs.push('- **Python** 3.9+');
  if (snapshot.detectedStack.includes('Rust')) prereqs.push('- **Rust** (latest stable via `rustup`)');
  if (snapshot.detectedStack.includes('Go')) prereqs.push('- **Go** 1.20+');
  if (snapshot.detectedStack.includes('Docker') || analysis.configFiles.some(c=>c.file.includes('Docker'))) prereqs.push('- **Docker**');
  prereqs.push('- **Git**');

  // Install steps
  let installCmd = 'npm install';
  if (snapshot.fileTree.includes('yarn.lock')) installCmd = 'yarn install';
  else if (snapshot.fileTree.includes('pnpm-lock.yaml')) installCmd = 'pnpm install';
  else if (snapshot.detectedStack.includes('Python')) installCmd = 'pip install -r requirements.txt';
  else if (snapshot.detectedStack.includes('Rust')) installCmd = 'cargo build';
  else if (snapshot.detectedStack.includes('Go')) installCmd = 'go mod download';
  else if (snapshot.fileTree.includes('Makefile')) installCmd = 'make install';
  
  if (pkg.workspaces) installCmd += '\n   # Monorepo workspaces detected, installing across all packages';

  const devCmd = pkg.scripts?.dev ? 'npm run dev' :
    pkg.scripts?.start ? 'npm start' :
    snapshot.detectedStack.includes('Python') ? 'python main.py' : '# Start the application';
  const buildCmd = pkg.scripts?.build ? 'npm run build' : '# Build for production';

  // Troubleshooting
  const faqEntries: string[] = [];
  if (pkg.dependencies) {
    faqEntries.push(`<details>\n<summary><strong>npm install fails or modules are missing</strong></summary>\n<br>\nDelete <code>node_modules</code> and the lockfile, then reinstall:\n\n\`\`\`bash\nrm -rf node_modules package-lock.json\nnpm install\n\`\`\`\n</details>`);
  }
  if (pkg.scripts?.dev || pkg.scripts?.start) {
    faqEntries.push(`<details>\n<summary><strong>Port already in use</strong></summary>\n<br>\nAnother process is using the same port. Either stop it or change the port in your <code>.env</code> file.\n</details>`);
  }
  faqEntries.push(`<details>\n<summary><strong>Environment variables not loading</strong></summary>\n<br>\nMake sure you have a <code>.env</code> file in the project root. Copy from <code>.env.example</code> if available.\n</details>`);

  const entryPointsMd = analysis.entryPoints.length > 0 ? `\n\n**Entry Points:**\n${analysis.entryPoints.map(e => `- \`${e.file}\`: ${e.bootstraps}`).join('\n')}` : '';

  let testSection = '';
  if (pkg.scripts?.test || pkg.scripts?.lint || analysis.configFiles.some(c=>c.file.includes('jest'))) {
    testSection = `## 🧪 Testing\n\n\`\`\`bash${pkg.scripts?.test ? '\n# Run tests\nnpm test' : ''}${pkg.scripts?.lint ? '\n\n# Lint code\nnpm run lint' : ''}\n\`\`\`\n\n---\n\n`;
  }

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
  <a href="#-project-structure"><img src="https://img.shields.io/badge/📂_Structure-ca8a04?style=for-the-badge" alt="Structure" /></a>
</p>

<br />

<p align="center">
  ${techBadges}
  <img src="https://img.shields.io/badge/Version-${encodeURIComponent(version)}-3178c6?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/License-${encodeURIComponent(license)}-22c55e?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**${name}** contains **${fileCount} files** across **${folders.size} directories**.
Total Lines of Code: **${analysis.metrics.totalLoc}** lines.
${Object.entries(analysis.metrics.locByLang).map(([ext, loc]) => `* \`${ext}\`: ${loc} lines`).join('\n')}

The most common file extensions are ${topExtensions || 'source files'}.

## 🏗️ Architecture

${architecture}${entryPointsMd}

---

## ✨ Key Features

${features.join('\n')}

---

## ⚙️ Tech Stack

| Technology | Category | Role |
| :--- | :--- | :--- |
${techMatrixRows || '| *No specific frameworks detected* | — | — |'}

---

${apiSection}${dbSection}## 📂 Project Structure

\`\`\`text
${name}/
${topTree}
\`\`\`

| Directory | Purpose |
| :--- | :--- |
${directoryRows}
${projectStructureExtra}
---

${compSection}${expSection}${configSection}${cicdSection}${scriptsSection}${depsSection}## 🚀 Getting Started

### Prerequisites

${prereqs.join('\n')}

### Setup

1. **Clone the repo**
   \`\`\`bash
   git clone <repository-url>
   cd ${name}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   ${installCmd}
   \`\`\`

3. **Set up environment** (if applicable)
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your values
   \`\`\`

4. **Run in development**
   \`\`\`bash
   ${devCmd}
   \`\`\`

5. **Build for production**
   \`\`\`bash
   ${buildCmd}
   \`\`\`

---

${envSection}${testSection}## ❓ Troubleshooting

${faqEntries.join('\n\n')}

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (\`git checkout -b feature/my-feature\`)
3. Commit changes (\`git commit -m "Add my feature"\`)
4. Push (\`git push origin feature/my-feature\`)
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
