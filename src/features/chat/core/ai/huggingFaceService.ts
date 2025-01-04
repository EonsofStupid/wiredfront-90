import { HfInference } from '@huggingface/inference';
import { supabase } from '@/integrations/supabase/client';

let hf: HfInference | null = null;

const initializeHF = async () => {
  try {
    const { data: settings } = await supabase
      .from('chat_settings')
      .select('api_key')
      .single();
    
    if (settings?.api_key) {
      hf = new HfInference(settings.api_key);
    } else {
      console.error('No API key found in settings');
    }
  } catch (error) {
    console.error('Error initializing Hugging Face client:', error);
  }
};

export const generateResponse = async (prompt: string): Promise<string> => {
  if (!hf) {
    await initializeHF();
  }
  
  if (!hf) {
    throw new Error('Hugging Face client not initialized');
  }

  try {
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      parameters: {
        max_length: 100,
        temperature: 0.7,
      },
    });

    return response.generated_text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};