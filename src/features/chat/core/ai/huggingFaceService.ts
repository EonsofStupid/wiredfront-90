import { HfInference } from '@huggingface/inference';
import { supabase } from '@/integrations/supabase/client';

let hf: HfInference | null = null;

export const initializeHuggingFace = async () => {
  const { data: { secret } } = await supabase.rpc('get_secret', { secret_name: 'huggingface_api_key' });
  if (!secret) {
    throw new Error('Hugging Face API key not found');
  }
  hf = new HfInference(secret);
  return hf;
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
    console.error('Error generating response:', error);
    throw error;
  }
};