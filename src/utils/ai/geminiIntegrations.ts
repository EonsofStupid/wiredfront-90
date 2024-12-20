import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

let geminiApi: GoogleGenerativeAI;

export const initializeGemini = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'GEMINI_API_KEY' }
    });
    
    if (error) throw error;
    
    geminiApi = new GoogleGenerativeAI(data.secret);
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    return false;
  }
};

export const generateGeminiResponse = async (prompt: string) => {
  if (!geminiApi) {
    await initializeGemini();
  }

  const model = geminiApi.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};