import { Router } from "express";
import { generateDocumentation, reviseDocumentation } from "../services/aiService";
import { createRepositorySnapshot } from "../services/githubService";
import { approveFiles, createJob, getJob, setJobStatus, setRepository, setResult } from "../services/jobStore";
import type { BuildAiRequest, DocumentationDepth, DocumentationFile } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError, assertValidString } from "../utils/httpErrors";

const router = Router();
const depths = new Set<DocumentationDepth>(["readme-only", "standard", "complete"]);

router.post(
  "/jobs",
  asyncHandler(async (req, res) => {
    const request = parseBuildRequest(req.body);
    const job = createJob(request);

    void runGenerationJob(job.id);

    res.status(202).json({ job: getPublicJob(job.id) });
  }),
);

router.post(
  "/generate",
  asyncHandler(async (req, res) => {
    const request = parseBuildRequest(req.body);
    const job = createJob(request);

    await runGenerationJob(job.id);
    res.status(job.status === "failed" ? 500 : 201).json({ job: getPublicJob(job.id) });
  }),
);

router.get(
  "/jobs/:jobId",
  asyncHandler(async (req, res) => {
    res.json({ job: getPublicJob(getParam(req.params.jobId, "jobId")) });
  }),
);

router.post(
  "/jobs/:jobId/revise",
  asyncHandler(async (req, res) => {
    const job = getExistingJob(getParam(req.params.jobId, "jobId"));
    if (!job.repository || !job.result) {
      throw new HttpError(409, "Job must have a generated draft before it can be revised.");
    }

    const feedback = assertValidString(req.body?.feedback, "feedback", 4000);
    setJobStatus(job.id, "revising");
    const revised = await reviseDocumentation(job.request, job.repository, job.result, feedback);
    setResult(job.id, revised);
    setJobStatus(job.id, "needs_review");

    res.json({ job: getPublicJob(job.id) });
  }),
);

router.post(
  "/jobs/:jobId/approve",
  asyncHandler(async (req, res) => {
    const job = getExistingJob(getParam(req.params.jobId, "jobId"));
    if (!job.result) {
      throw new HttpError(409, "Job has no generated documentation to approve.");
    }

    const approvedPaths = Array.isArray(req.body?.approvedPaths)
      ? req.body.approvedPaths.filter((path: unknown): path is string => typeof path === "string")
      : undefined;

    const allFiles: DocumentationFile[] = [
      { path: "README.md", title: "README", content: job.result.readme },
      ...job.result.docs,
    ];

    const files = approvedPaths?.length ? allFiles.filter((file) => approvedPaths.includes(file.path)) : allFiles;
    const updated = approveFiles(job.id, files);

    res.json({ job: getPublicJob(updated.id), files });
  }),
);

async function runGenerationJob(jobId: string) {
  try {
    const job = getExistingJob(jobId);
    setJobStatus(jobId, "scraping");
    const repository = await createRepositorySnapshot(job.request.githubUrl);
    setRepository(jobId, repository);

    setJobStatus(jobId, "generating");
    const result = await generateDocumentation(job.request, repository);
    setResult(jobId, result);
    setJobStatus(jobId, "needs_review");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed.";
    setJobStatus(jobId, "failed", message);
  }
}

function parseBuildRequest(body: unknown): BuildAiRequest {
  const payload = body as Partial<BuildAiRequest> | undefined;
  const projectName = assertValidString(payload?.projectName, "projectName", 120);
  const githubUrl = assertValidString(payload?.githubUrl, "githubUrl", 300);
  const instructions =
    typeof payload?.instructions === "string" && payload.instructions.trim()
      ? payload.instructions.trim().slice(0, 4000)
      : undefined;
  const groqApiKey = assertValidString(payload?.groqApiKey, "groqApiKey", 300);

  const documentationDepth = payload?.documentationDepth ?? "standard";
  if (!depths.has(documentationDepth)) {
    throw new HttpError(400, "documentationDepth must be readme-only, standard, or complete.");
  }

  return {
    projectName,
    githubUrl,
    groqApiKey,
    instructions,
    documentationDepth,
  };
}

function getExistingJob(jobId: string) {
  const job = getJob(jobId);
  if (!job) {
    throw new HttpError(404, "Job not found.");
  }
  return job;
}

function getParam(value: string | string[] | undefined, name: string) {
  if (typeof value !== "string" || !value) {
    throw new HttpError(400, `${name} route parameter is required.`);
  }

  return value;
}

function getPublicJob(jobId: string) {
  const job = getExistingJob(jobId);
  return {
    ...job,
    request: {
      ...job.request,
      groqApiKey: undefined,
    },
    repository: job.repository
      ? {
          owner: job.repository.owner,
          repo: job.repository.repo,
          githubUrl: job.repository.githubUrl,
          fileCount: job.repository.fileTree.length,
          sampledFileCount: job.repository.files.length,
          detectedStack: job.repository.detectedStack,
        }
      : undefined,
  };
}

export default router;
