export type DocumentationDepth = "readme-only" | "standard" | "complete";

export interface BuildAiRequest {
  projectName: string;
  githubUrl: string;
  groqApiKey?: string;
  instructions?: string;
  documentationDepth?: DocumentationDepth;
}

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

export interface DocumentationFile {
  path: string;
  title: string;
  content: string;
}

export interface GeneratedDocumentation {
  readme: string;
  docs: DocumentationFile[];
  summary: string;
  creatorQuestions: string[];
}

export type JobStatus = "queued" | "scraping" | "generating" | "needs_review" | "revising" | "approved" | "failed";

export interface BuildJob {
  id: string;
  status: JobStatus;
  request: BuildAiRequest;
  createdAt: string;
  updatedAt: string;
  error?: string;
  repository?: RepositorySnapshot;
  result?: GeneratedDocumentation;
  approvedFiles?: DocumentationFile[];
}
