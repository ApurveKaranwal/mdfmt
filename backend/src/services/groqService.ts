import { config } from "../config";
import { BuildAiRequest, GeneratedDocumentation, RepositorySnapshot } from "../types";
import { AdvancedAnalysis } from "./advancedAnalysis";
import {
  buildAdvancedReadmePrompt,
  buildAdvancedReadmeSystemPrompt,
  buildArchitectureDocumentPrompt,
  buildArchitectureDocumentSystemPrompt,
  buildApiReferencePrompt,
  buildApiReferenceSystemPrompt,
  buildSetupGuidePrompt,
  buildSetupGuideSystemPrompt,
} from "./advancedPrompts";

/**
 * Service to generate documentation using Groq's LLMs via native fetch
 */

async function callGroqLLM(systemPrompt: string, userPrompt: string, apiKey: string): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const payload = {
    model: config.groqModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Groq API Error:", response.status, errorBody);
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Received empty response from Groq API");
  }

  return content;
}

export async function generateDocumentationWithGroq(
  request: BuildAiRequest,
  repository: RepositorySnapshot,
  analysis: AdvancedAnalysis,
  apiKey: string
): Promise<GeneratedDocumentation> {
  const projectName = request.projectName || repository.repo;

  console.log("Generating README using Groq...");
  const readmeUserPrompt = buildAdvancedReadmePrompt(request, repository, analysis);
  const readmeSystemPrompt = buildAdvancedReadmeSystemPrompt();
  const readme = await callGroqLLM(readmeSystemPrompt, readmeUserPrompt, apiKey);

  const docs = [];

  if (request.documentationDepth !== "readme-only") {
    console.log("Generating Architecture doc using Groq...");
    const archUserPrompt = buildArchitectureDocumentPrompt(projectName, repository, analysis);
    const archSystemPrompt = buildArchitectureDocumentSystemPrompt();
    const architecture = await callGroqLLM(archSystemPrompt, archUserPrompt, apiKey);
    docs.push({
      path: "docs/architecture.md",
      title: "Architecture",
      content: architecture,
    });

    if (analysis.apiEndpoints.length > 0) {
      console.log("Generating API Reference using Groq...");
      const apiUserPrompt = buildApiReferencePrompt(projectName, analysis, repository);
      const apiSystemPrompt = buildApiReferenceSystemPrompt();
      const apiReference = await callGroqLLM(apiSystemPrompt, apiUserPrompt, apiKey);
      docs.push({
        path: "docs/api-reference.md",
        title: "API Reference",
        content: apiReference,
      });
    }

    console.log("Generating Setup Guide using Groq...");
    const setupUserPrompt = buildSetupGuidePrompt(projectName, analysis);
    const setupSystemPrompt = buildSetupGuideSystemPrompt();
    const setupGuide = await callGroqLLM(setupSystemPrompt, setupUserPrompt, apiKey);
    docs.push({
      path: "docs/setup-guide.md",
      title: "Setup Guide",
      content: setupGuide,
    });
  }

  return {
    readme,
    docs,
    summary: `Successfully generated AI documentation using ${config.groqModel} via Groq.`,
    creatorQuestions: [], // Could be populated by asking the LLM to generate questions in a separate call
  };
}

export async function generateDiagramWithGroq(
  prompt: string,
  apiKey: string
): Promise<string> {
  const systemPrompt = `You are an expert software architect and Mermaid.js specialist.
Your task is to take a user's plain-English description of an architecture, workflow, or system and translate it strictly into Mermaid.js syntax.

RULES:
1. ONLY output the raw Mermaid.js markdown block.
2. DO NOT include any surrounding text, explanations, or conversational filler like "Here is your diagram".
3. Use a markdown fenced code block with \`\`\`mermaid.
4. Make the diagrams beautiful, well-structured, and use standard Mermaid diagram types (graph TD, sequenceDiagram, etc).
5. If the user doesn't specify a type, default to a top-down flowchart (graph TD) or left-to-right (graph LR).`;

  const userPrompt = `Generate a Mermaid diagram for the following description:\n\n${prompt}`;

  return await callGroqLLM(systemPrompt, userPrompt, apiKey);
}
