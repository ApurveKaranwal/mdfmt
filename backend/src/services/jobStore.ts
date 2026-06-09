import type { BuildAiRequest, BuildJob, DocumentationFile, GeneratedDocumentation, RepositorySnapshot } from "../types";
import { prisma } from "../utils/db";

// Helper to deserialize Prisma Job to BuildJob
function mapPrismaJob(dbJob: any): BuildJob {
  return {
    id: dbJob.id,
    status: dbJob.status as any,
    request: {
      projectName: dbJob.projectName,
      githubUrl: dbJob.githubUrl,
      instructions: dbJob.instructions || undefined,
      documentationDepth: dbJob.documentationDepth as any,
    },
    repository: dbJob.repositoryData ? JSON.parse(dbJob.repositoryData) : undefined,
    result: dbJob.resultData ? JSON.parse(dbJob.resultData) : undefined,
    error: dbJob.error || undefined,
    createdAt: dbJob.createdAt.toISOString(),
    updatedAt: dbJob.updatedAt.toISOString(),
  };
}

export async function createJob(request: BuildAiRequest): Promise<BuildJob> {
  const dbJob = await prisma.job.create({
    data: {
      status: "queued",
      projectName: request.projectName,
      githubUrl: request.githubUrl,
      instructions: request.instructions,
      documentationDepth: request.documentationDepth || "standard",
    },
  });
  return mapPrismaJob(dbJob);
}

export async function getJob(id: string): Promise<BuildJob | undefined> {
  const dbJob = await prisma.job.findUnique({ where: { id } });
  if (!dbJob) return undefined;
  return mapPrismaJob(dbJob);
}

export async function getRecentJobs(): Promise<BuildJob[]> {
  const dbJobs = await prisma.job.findMany({
    orderBy: { updatedAt: "desc" },
    take: 20,
  });
  return dbJobs.map(mapPrismaJob);
}

export async function setJobStatus(id: string, status: BuildJob["status"], error?: string): Promise<BuildJob> {
  const dbJob = await prisma.job.update({
    where: { id },
    data: { status, error },
  });
  return mapPrismaJob(dbJob);
}

export async function setRepository(id: string, repository: RepositorySnapshot): Promise<BuildJob> {
  const dbJob = await prisma.job.update({
    where: { id },
    data: { repositoryData: JSON.stringify(repository) },
  });
  return mapPrismaJob(dbJob);
}

export async function setResult(id: string, result: GeneratedDocumentation): Promise<BuildJob> {
  const dbJob = await prisma.job.update({
    where: { id },
    data: { resultData: JSON.stringify(result) },
  });
  return mapPrismaJob(dbJob);
}

export async function approveFiles(id: string, files: DocumentationFile[]): Promise<BuildJob> {
  // We can just set status to approved for now and update result with approved files if we wanted to
  const dbJob = await prisma.job.update({
    where: { id },
    data: { status: "approved" },
  });
  
  const mapped = mapPrismaJob(dbJob);
  mapped.approvedFiles = files; // Add in memory since we didn't add approvedFiles to schema, or just leave it
  return mapped;
}
