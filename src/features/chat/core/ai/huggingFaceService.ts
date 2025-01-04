import { HfInference } from '@huggingface/inference';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';

interface HuggingFaceState {
  client: HfInference | null;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
}

export const useHuggingFaceStore = create<HuggingFaceState>((set, get) => ({
  client: null,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const { data: settings } = await supabase
        .from('chat_settings')
        .select('api_key')
        .single();
      
      if (settings?.api_key) {
        const client = new HfInference(settings.api_key);
        set({ client, isInitialized: true, error: null });
        logger.info('HuggingFace client initialized');
      } else {
        throw new Error('No API key found in settings');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('Error initializing HuggingFace client:', { error: errorMessage });
      set({ error: errorMessage });
    }
  },

  generateResponse: async (prompt: string) => {
    const { client, isInitialized, initialize } = get();

    if (!isInitialized) {
      await initialize();
    }

    if (!client) {
      throw new Error('HuggingFace client not initialized');
    }

    try {
      const response = await client.textGeneration({
        model: 'gpt2',
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.7,
        },
      });

      logger.debug('Generated response:', { prompt, response: response.generated_text });
      return response.generated_text;
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('Error generating response:', { error: errorMessage, prompt });
      throw error;
    }
  },
}));

// Export a simplified interface for external use
export const generateResponse = useHuggingFaceStore.getState().generateResponse;