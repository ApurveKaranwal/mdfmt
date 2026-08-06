import fs from 'fs-extra';
import path from 'path';
import ignore from 'ignore';

export interface RepositoryFile {
  path: string;
  language: string;
  size: number;
  content: string;
}

export interface RepositorySnapshot {
  owner: string;
  repo: string;
  defaultBranch?: string;
  githubUrl: string;
  fileTree: string[];
  files: RepositoryFile[];
  packageManifests: Record<string, unknown>[];
  detectedStack: string[];
}

const DEFAULT_IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.out',
  'coverage',
  '.cache',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env*',
  '*.pem',
  '*.key',
  '*.ico',
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.gif',
  '*.svg',
  '*.pdf',
  '*.zip',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib',
  '*.pyc',
  '__pycache__',
  '.DS_Store'
];

const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.py': 'Python',
  '.rs': 'Rust',
  '.go': 'Go',
  '.java': 'Java',
  '.c': 'C',
  '.cpp': 'C++',
  '.cs': 'C#',
  '.json': 'JSON',
  '.yaml': 'YAML',
  '.yml': 'YAML',
  '.md': 'Markdown',
  '.html': 'HTML',
  '.css': 'CSS',
  '.scss': 'SCSS',
  '.sh': 'Shell',
  '.sql': 'SQL'
};

const SECRET_PATTERNS = [
  /(?:api[_-]?key|secret|password|auth|token|private[_-]?key)\s*[:=]\s*["']?([A-Za-z0-9_\-]{8,})["']?/gi,
  /sk_live_[0-9a-zA-Z]{24}/g,
  /ghp_[0-9a-zA-Z]{36}/g,
  /AKIA[0-9A-Z]{16}/g
];

export async function scanLocalRepository(rootDir: string): Promise<RepositorySnapshot> {
  const repoName = path.basename(rootDir) || 'local-project';
  const ig = ignore().add(DEFAULT_IGNORED_PATTERNS);

  const gitignorePath = path.join(rootDir, '.gitignore');
  if (await fs.pathExists(gitignorePath)) {
    try {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
      ig.add(gitignoreContent);
    } catch {
      // Ignore gitignore read errors
    }
  }

  const allRelativeFiles: string[] = [];
  await walkDirectory(rootDir, rootDir, ig, allRelativeFiles);

  const detectedStackSet = new Set<string>();
  const packageManifests: Record<string, unknown>[] = [];
  const sampledFiles: RepositoryFile[] = [];

  // Inspect manifest files first
  for (const fileRel of allRelativeFiles) {
    const filename = path.basename(fileRel).toLowerCase();
    const fullPath = path.join(rootDir, fileRel);

    if (filename === 'package.json') {
      try {
        const pkgJson = await fs.readJson(fullPath);
        packageManifests.push(pkgJson);
        detectedStackSet.add('Node.js');
        if (pkgJson.dependencies?.react || pkgJson.devDependencies?.react) detectedStackSet.add('React');
        if (pkgJson.dependencies?.next || pkgJson.devDependencies?.next) detectedStackSet.add('Next.js');
        if (pkgJson.dependencies?.express || pkgJson.devDependencies?.express) detectedStackSet.add('Express');
        if (pkgJson.dependencies?.typescript || pkgJson.devDependencies?.typescript) detectedStackSet.add('TypeScript');
        if (pkgJson.dependencies?.tailwindcss || pkgJson.devDependencies?.tailwindcss) detectedStackSet.add('TailwindCSS');
        if (pkgJson.dependencies?.prisma || pkgJson.devDependencies?.prisma) detectedStackSet.add('Prisma');
        if (pkgJson.dependencies?.vite || pkgJson.devDependencies?.vite) detectedStackSet.add('Vite');
      } catch {
        // ignore JSON parse error
      }
    } else if (filename === 'cargo.toml') {
      detectedStackSet.add('Rust');
    } else if (filename === 'pyproject.toml' || filename === 'requirements.txt') {
      detectedStackSet.add('Python');
    } else if (filename === 'go.mod') {
      detectedStackSet.add('Go');
    } else if (filename === 'dockerfile' || filename === 'docker-compose.yml') {
      detectedStackSet.add('Docker');
    }

    const ext = path.extname(fileRel).toLowerCase();
    if (EXT_TO_LANG[ext]) {
      detectedStackSet.add(EXT_TO_LANG[ext]);
    }
  }

  // Sample relevant source files (up to 30 files max)
  const prioritizeFiles = allRelativeFiles.filter((f) => {
    const name = path.basename(f).toLowerCase();
    return (
      name.includes('config') ||
      name.includes('server') ||
      name.includes('index') ||
      name.includes('app') ||
      name.includes('main') ||
      name === 'package.json' ||
      name === 'cargo.toml' ||
      name === 'pyproject.toml' ||
      name === 'go.mod' ||
      name === 'dockerfile'
    );
  });

  const remainingFiles = allRelativeFiles.filter((f) => !prioritizeFiles.includes(f));
  const selectedFiles = [...prioritizeFiles, ...remainingFiles].slice(0, 30);

  for (const fileRel of selectedFiles) {
    const fullPath = path.join(rootDir, fileRel);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.size > 50000) continue; // Skip large files > 50KB

      let content = await fs.readFile(fullPath, 'utf-8');
      content = sanitizeSecrets(content);

      const ext = path.extname(fileRel).toLowerCase();
      sampledFiles.push({
        path: fileRel.replace(/\\/g, '/'),
        language: EXT_TO_LANG[ext] || 'PlainText',
        size: stats.size,
        content: content.slice(0, 5000) // Truncate individual file sample to 5KB max
      });
    } catch {
      // Ignore unreadable files
    }
  }

  return {
    owner: 'local',
    repo: repoName,
    defaultBranch: 'main',
    githubUrl: `local://${repoName}`,
    fileTree: allRelativeFiles.map((f) => f.replace(/\\/g, '/')),
    files: sampledFiles,
    packageManifests,
    detectedStack: Array.from(detectedStackSet)
  };
}

async function walkDirectory(
  rootDir: string,
  currentDir: string,
  ig: any,
  results: string[],
  depth = 0
) {
  if (depth > 6) return;

  const items = await fs.readdir(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const relativePath = path.relative(rootDir, fullPath);

    if (ig.ignores(relativePath)) {
      continue;
    }

    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      await walkDirectory(rootDir, fullPath, ig, results, depth + 1);
    } else if (stats.isFile()) {
      results.push(relativePath);
    }
  }
}

function sanitizeSecrets(content: string): string {
  let sanitized = content;
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
  }
  return sanitized;
}
