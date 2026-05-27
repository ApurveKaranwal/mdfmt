import crypto from "node:crypto";
import type { BuildAiRequest, BuildJob, DocumentationFile, GeneratedDocumentation, RepositorySnapshot } from "../types";

const jobs = new Map<string, BuildJob>();

export function createJob(request: BuildAiRequest) {
  const now = new Date().toISOString();
  const job: BuildJob = {
    id: crypto.randomUUID(),
    status: "queued",
    request,
    createdAt: now,
    updatedAt: now,
  };

  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string) {
  return jobs.get(id);
}

export function setJobStatus(id: string, status: BuildJob["status"], error?: string) {
  const job = mustGetJob(id);
  job.status = status;
  job.updatedAt = new Date().toISOString();
  job.error = error;
  return job;
}

export function setRepository(id: string, repository: RepositorySnapshot) {
  const job = mustGetJob(id);
  job.repository = repository;
  job.updatedAt = new Date().toISOString();
  return job;
}

export function setResult(id: string, result: GeneratedDocumentation) {
  const job = mustGetJob(id);
  job.result = result;
  job.updatedAt = new Date().toISOString();
  return job;
}

export function approveFiles(id: string, files: DocumentationFile[]) {
  const job = mustGetJob(id);
  job.approvedFiles = files;
  job.status = "approved";
  job.updatedAt = new Date().toISOString();
  return job;
}

function mustGetJob(id: string) {
  const job = jobs.get(id);
  if (!job) {
    throw new Error(`Job ${id} not found.`);
  }
  return job;
}
