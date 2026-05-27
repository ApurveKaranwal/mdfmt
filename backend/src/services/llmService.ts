import Groq from "groq-sdk";
import { config } from "../config";

export function isLLMAvailable(apiKey?: string): boolean {
  return Boolean(apiKey?.trim());
}

export async function generateWithLLM(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.6,
): Promise<string> {
  const groq = new Groq({ apiKey: apiKey.trim() });

  const response = await groq.chat.completions.create({
    model: config.groqModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: 12000,
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("LLM returned an empty response.");
  }

  return text.trim();
}
