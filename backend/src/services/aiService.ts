import { config } from "../config";
import type { BuildAiRequest, GeneratedDocumentation, RepositorySnapshot } from "../types";
import { generateDocumentation as customGenerateDocumentation } from "./customDocWriter";
import { performAdvancedAnalysis } from "./advancedAnalysis";
import { initMLEngine } from "./mlEngine";
import { generateDocumentationWithGroq } from "./groqService";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateDocumentationWithAnalysis(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
): Promise<GeneratedDocumentation> {
  // Initialize local AI/ML engine
  await initMLEngine();

  // Perform advanced analysis using ML
  const advancedAnalysis = await performAdvancedAnalysis(repository, request.projectName || repository.repo);

  // Check if a Groq API Key is available (either from user request or global config)
  const groqKey = request.groqApiKey || config.groqApiKey;

  let groqErrorMsg = "";

  if (groqKey) {
    try {
      console.log("Groq API Key detected. Routing to Llama 3 LLM...");
      return await generateDocumentationWithGroq(request, repository, advancedAnalysis, groqKey);
    } catch (e: any) {
      console.error("Groq generation failed. Falling back to template writer.", e);
      groqErrorMsg = e.message || "Unknown error";
    }
  }

  console.log("No Groq API Key or Groq failed. Using fallback template writer...");
  // Generate all documentation using custom writer (no external dependencies)
  const docs = customGenerateDocumentation(
    request.projectName || repository.repo,
    repository,
    advancedAnalysis,
    request.instructions,
  );

  // Format as documentation files
  const generatedDocs = [
    {
      path: "docs/architecture.md",
      title: "Architecture",
      content: docs.architecture,
    },
    {
      path: "docs/api-reference.md",
      title: "API Reference",
      content: docs.apiReference,
    },
    {
      path: "docs/setup-guide.md",
      title: "Setup Guide",
      content: docs.setupGuide,
    },
  ];

  // Add integrations guide if there are integrations
  if (advancedAnalysis.externalIntegrations.length > 0) {
    generatedDocs.push({
      path: "docs/integrations.md",
      title: "Integrations",
      content: docs.integrations,
    });
  }

  return {
    readme: docs.readme,
    docs: generatedDocs,
    summary: `Generated documentation using in-house template. DEBUG INFO: groqKey length is ${groqKey ? groqKey.length : 0}. ${groqErrorMsg ? `Groq Error: ${groqErrorMsg}` : "No error thrown, just skipped."}`,
    creatorQuestions: buildCreatorQuestionsFromAnalysis(advancedAnalysis, request),
  };
}

export async function generateDocumentation(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
): Promise<GeneratedDocumentation> {
  return generateDocumentationWithAnalysis(request, repository);
}

export async function reviseDocumentation(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  previous: GeneratedDocumentation,
  feedback: string,
): Promise<GeneratedDocumentation> {
  // For revision, regenerate with updated instructions
  const updatedRequest = {
    ...request,
    instructions: [request.instructions || "", `Revise based on feedback:\n${feedback}`].filter(Boolean).join("\n"),
  };

  const revised = await generateDocumentationWithAnalysis(updatedRequest, repository);

  return {
    ...revised,
    summary: `Revised documentation based on feedback: "${feedback.slice(0, 100)}..."`,
  };
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function buildCreatorQuestionsFromAnalysis(analysis: any, request: BuildAiRequest): string[] {
  const questions: string[] = [];

  if (analysis.apiEndpoints.length === 0) {
    questions.push("Does this project expose any HTTP APIs? If so, describe the endpoints.");
  }

  if (analysis.externalIntegrations.length === 0) {
    questions.push("Are there any external services or APIs this project depends on?");
  }

  if (analysis.authMethods.length === 0) {
    questions.push("What authentication method does this project use?");
  }

  if (!analysis.databaseType) {
    questions.push("What database or storage solution does this project use?");
  }

  if (analysis.coreFeatures.length < 3) {
    questions.push("What are the 3-5 core features of this project?");
  }

  if (!request.instructions) {
    questions.push("Are there any specific documentation requirements or special considerations?");
  }

  return questions;
}
