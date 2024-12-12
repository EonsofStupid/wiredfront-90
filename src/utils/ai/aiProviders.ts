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
      case "chatgpt":
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
      case "mistral":
        const { data: mistralResponse, error: mistralError } = await supabase.functions.invoke("generate-with-mistral", {
          body: { prompt }
        });
        if (mistralError) throw mistralError;
        return mistralResponse.text;
      case "cohere":
        const { data: cohereResponse, error: cohereError } = await supabase.functions.invoke("generate-with-cohere", {
          body: { prompt }
        });
        if (cohereError) throw cohereError;
        return cohereResponse.text;
      default:
        const _exhaustiveCheck: never = provider;
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};