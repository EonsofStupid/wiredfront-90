import { generateGeminiResponse } from "./geminiIntegrations";
import { supabase } from "@/integrations/supabase/client";
import type { AIProvider } from "@/types/ai";

export const generateAIResponse = async (
  provider: AIProvider,
  prompt: string
): Promise<string> => {
  try {
    switch (provider) {
      case "gemini":
        return await generateGeminiResponse(prompt);
      case "openai":
        const { data: openaiResponse } = await supabase.functions.invoke("generate-with-openai", {
          body: { prompt }
        });
        return openaiResponse.text;
      case "anthropic":
        const { data: anthropicResponse } = await supabase.functions.invoke("generate-with-anthropic", {
          body: { prompt }
        });
        return anthropicResponse.text;
      case "huggingface":
        const { data: hfResponse } = await supabase.functions.invoke("generate-with-huggingface", {
          body: { prompt }
        });
        return hfResponse.text;
      default:
        throw new Error("Provider not supported");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};