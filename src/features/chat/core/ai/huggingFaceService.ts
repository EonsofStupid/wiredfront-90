import { HfInference } from '@huggingface/inference';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

let hf: HfInference | null = null;

export const initializeHuggingFace = async () => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('value')
      .eq('setting_id', 'huggingface_api_key')
      .single();

    if (error) {
      throw error;
    }

    if (!data?.value) {
      throw new Error('Hugging Face API key not found');
    }

    const apiKey = data.value as string;
    hf = new HfInference(apiKey);
    return hf;
  } catch (error) {
    logger.error('Failed to initialize Hugging Face:', error);
    throw error;
  }
};

export const getHuggingFaceClient = async () => {
  if (!hf) {
    return initializeHuggingFace();
  }
  return hf;
};

export const generateResponse = async (prompt: string) => {
  const hf = await getHuggingFaceClient();
  try {
    const response = await hf.textGeneration({
      model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
      },
    });
    return response.generated_text;
  } catch (error) {
    logger.error('Error generating response:', error);
    throw error;
  }
};