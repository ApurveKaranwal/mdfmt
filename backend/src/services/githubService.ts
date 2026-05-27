import { spawn } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { config } from "../config";
import type { RepositoryFile, RepositorySnapshot } from "../types";
import { HttpError } from "../utils/httpErrors";

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "coverage",
  ".turbo",
  ".cache",
  ".venv",
  "venv",
  "__pycache__",
  "target",
  "vendor",
]);

const TEXT_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".mdx",
  ".css",
  ".scss",
  ".html",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".kt",
  ".php",
  ".rb",
  ".cs",
  ".c",
  ".cpp",
  ".h",
  ".yml",
  ".yaml",
  ".toml",
  ".xml",
  ".sql",
  ".sh",
  ".env.example",
  ".dockerfile",
]);

const PRIORITY_FILES = [
  "package.json",
  "README.md",
  "readme.md",
  "pyproject.toml",
  "requirements.txt",
  "Cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "Dockerfile",
  "docker-compose.yml",
  "src",
  "app",
  "pages",
  "components",
  "lib",
  "server",
  "backend",
  "frontend",
];

export function parseGitHubUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new HttpError(400, "githubUrl must be a valid GitHub repository URL.");
  }

  if (url.hostname !== "github.com") {
    throw new HttpError(400, "Only github.com repository URLs are supported.");
  }

  const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !rawRepo) {
    throw new HttpError(400, "githubUrl must point to a repository like https://github.com/owner/repo.");
  }

  const repo = rawRepo.replace(/\.git$/, "");
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new HttpError(400, "githubUrl contains unsupported owner or repository characters.");
  }

  return {
    owner,
    repo,
    cloneUrl: `https://github.com/${owner}/${repo}.git`,
    publicUrl: `https://github.com/${owner}/${repo}`,
  };
}

export async function createRepositorySnapshot(githubUrl: string): Promise<RepositorySnapshot> {
  const parsed = parseGitHubUrl(githubUrl);
  const tempDir = await mkdtemp(path.join(tmpdir(), "mdfmt-repo-"));

  try {
    await cloneRepository(parsed.cloneUrl, tempDir);
    const fileTree = await listRepositoryFiles(tempDir);
    const files = await readImportantFiles(tempDir, fileTree);
    const packageManifests = readPackageManifests(files);

    return {
      owner: parsed.owner,
      repo: parsed.repo,
      githubUrl: parsed.publicUrl,
      fileTree,
      files,
      packageManifests,
      detectedStack: detectStack(files, packageManifests),
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function cloneRepository(cloneUrl: string, targetDir: string) {
  const authenticatedUrl =
    config.githubToken && cloneUrl.startsWith("https://github.com/")
      ? cloneUrl.replace("https://github.com/", `https://x-access-token:${encodeURIComponent(config.githubToken)}@github.com/`)
      : cloneUrl;

  return new Promise<void>((resolve, reject) => {
    const child = spawn("git", ["clone", "--depth", "1", authenticatedUrl, targetDir], {
      stdio: ["ignore", "ignore", "pipe"],
      shell: false,
    });

    let error = "";
    child.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    child.on("error", () => {
      reject(new HttpError(500, "Git is required on the server to inspect repositories."));
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new HttpError(422, sanitizeGitError(error)));
    });
  });
}

function sanitizeGitError(error: string) {
  const message = error.replace(/https:\/\/x-access-token:[^@]+@github\.com\//g, "https://github.com/").trim();
  return message || "Unable to clone repository. Check that the link is correct and accessible.";
}

async function listRepositoryFiles(rootDir: string) {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = toPosix(path.relative(rootDir, absolutePath));

      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          await walk(absolutePath);
        }
        continue;
      }

      if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  await walk(rootDir);
  return files.sort();
}

async function readImportantFiles(rootDir: string, fileTree: string[]) {
  const ranked = [...fileTree].sort((a, b) => scoreFile(b) - scoreFile(a));
  const selected: RepositoryFile[] = [];
  let usedBytes = 0;

  for (const relativePath of ranked) {
    if (selected.length >= config.maxRepoFiles || usedBytes >= config.maxRepoBytes) {
      break;
    }

    if (!isReadableTextFile(relativePath)) {
      continue;
    }

    const absolutePath = path.join(rootDir, relativePath);
    const fileStat = await stat(absolutePath);
    if (fileStat.size > config.maxFileBytes * 4) {
      continue;
    }

    const raw = await readFile(absolutePath, "utf8").catch(() => "");
    if (!raw || looksBinary(raw)) {
      continue;
    }

    const content = raw.slice(0, config.maxFileBytes);
    selected.push({
      path: relativePath,
      language: inferLanguage(relativePath),
      size: fileStat.size,
      content,
    });
    usedBytes += Buffer.byteLength(content, "utf8");
  }

  return selected;
}

function scoreFile(filePath: string) {
  const lower = filePath.toLowerCase();
  let score = 0;

  for (const priority of PRIORITY_FILES) {
    if (lower === priority.toLowerCase() || lower.startsWith(`${priority.toLowerCase()}/`) || lower.includes(`/${priority.toLowerCase()}/`)) {
      score += 20;
    }
  }

  if (lower.includes("test") || lower.includes("spec")) score += 4;
  if (lower.includes("route") || lower.includes("controller") || lower.includes("service")) score += 8;
  if (lower.includes("schema") || lower.includes("model")) score += 8;
  if (lower.endsWith(".md")) score += 10;

  return score;
}

function isReadableTextFile(filePath: string) {
  const basename = path.basename(filePath).toLowerCase();
  if (basename === "dockerfile" || basename === ".env.example") {
    return true;
  }

  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function looksBinary(content: string) {
  return content.includes("\u0000");
}

function toPosix(value: string) {
  return value.split(path.sep).join("/");
}

function inferLanguage(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".js": "JavaScript",
    ".jsx": "React JSX",
    ".ts": "TypeScript",
    ".tsx": "React TSX",
    ".json": "JSON",
    ".md": "Markdown",
    ".mdx": "MDX",
    ".css": "CSS",
    ".scss": "SCSS",
    ".html": "HTML",
    ".py": "Python",
    ".go": "Go",
    ".rs": "Rust",
    ".java": "Java",
    ".kt": "Kotlin",
    ".php": "PHP",
    ".rb": "Ruby",
    ".cs": "C#",
    ".c": "C",
    ".cpp": "C++",
    ".h": "C/C++ Header",
    ".yml": "YAML",
    ".yaml": "YAML",
    ".toml": "TOML",
    ".xml": "XML",
    ".sql": "SQL",
    ".sh": "Shell",
  };

  return map[ext] ?? "Text";
}

function readPackageManifests(files: RepositoryFile[]) {
  return files
    .filter((file) => path.basename(file.path) === "package.json")
    .map((file) => {
      try {
        return JSON.parse(file.content) as Record<string, unknown>;
      } catch {
        return undefined;
      }
    })
    .filter((manifest): manifest is Record<string, unknown> => Boolean(manifest));
}

function detectStack(files: RepositoryFile[], manifests: Record<string, unknown>[]) {
  const stack = new Set<string>();
  const allPaths = files.map((file) => file.path.toLowerCase()).join("\n");

  if (allPaths.includes("package.json")) stack.add("Node.js");
  if (allPaths.includes("vite.config")) stack.add("Vite");
  if (allPaths.includes("tailwind.config")) stack.add("Tailwind CSS");
  if (allPaths.includes("next.config")) stack.add("Next.js");
  if (allPaths.includes("pyproject.toml") || allPaths.includes("requirements.txt")) stack.add("Python");
  if (allPaths.includes("go.mod")) stack.add("Go");
  if (allPaths.includes("cargo.toml")) stack.add("Rust");
  if (allPaths.includes("dockerfile")) stack.add("Docker");

  for (const manifest of manifests) {
    const deps = {
      ...(manifest.dependencies as Record<string, string> | undefined),
      ...(manifest.devDependencies as Record<string, string> | undefined),
    };

    if (deps.react) stack.add("React");
    if (deps.express) stack.add("Express");
    if (deps.hono) stack.add("Hono");
    if (deps.prisma) stack.add("Prisma");
    if (deps.firebase) stack.add("Firebase");
    if (deps.typescript) stack.add("TypeScript");
  }

  return [...stack].sort();
}
