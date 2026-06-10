import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "https://mdfmt.apurve.xyz",
  githubToken: process.env.GITHUB_TOKEN,
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  maxRepoFiles: Number(process.env.MAX_REPO_FILES ?? 220),
  maxRepoBytes: Number(process.env.MAX_REPO_BYTES ?? 260000),
  maxFileBytes: Number(process.env.MAX_FILE_BYTES ?? 12000),
};
