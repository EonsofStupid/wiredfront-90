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
        const { data: openaiResponse, error: openaiError } = await supabase.functions.invoke("generate-with-openai", {
          body: { prompt }
        });
        if (openaiError) throw openaiError;
        return openaiResponse.text;
      case "anthropic":
        const { data: anthropicResponse, error: anthropicError } = await supabase.functions.invoke("generate-with-anthropic", {
          body: { prompt }
        });
        if (anthropicError) throw anthropicError;
        return anthropicResponse.text;
      case "huggingface":
        const { data: hfResponse, error: hfError } = await supabase.functions.invoke("generate-with-huggingface", {
          body: { prompt }
        });
        if (hfError) throw hfError;
        return hfResponse.text;
      default:
        throw new Error("Provider not supported");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};