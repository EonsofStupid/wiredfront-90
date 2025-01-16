import { Pinecone } from '@pinecone-database/pinecone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type VectorStoreType = 'supabase' | 'pinecone';

export interface VectorStoreConfig {
  type: VectorStoreType;
  config: Record<string, any>;
}

let pineconeClient: Pinecone | null = null;

export const initializePinecone = async () => {
  try {
    const { data: config, error } = await supabase
      .from('vector_store_configs')
      .select('*')
      .eq('store_type', 'pinecone')
      .maybeSingle();

    if (error) throw error;
    if (!config) return null;

    const configData = config.config as Record<string, string>;
    
    // Updated Pinecone client initialization
    const client = new Pinecone({
      apiKey: configData.apiKey,
    });

    pineconeClient = client;
    return client;
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    toast.error('Failed to initialize vector store');
    return null;
  }
};

export const getPineconeClient = () => {
  if (!pineconeClient) {
    throw new Error('Pinecone client not initialized');
  }
  return pineconeClient;
};

export const getVectorStore = async (): Promise<VectorStoreConfig | null> => {
  try {
    const { data: config, error } = await supabase
      .from('vector_store_configs')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!config) return null;

    const storeType = config.store_type as VectorStoreType;
    
    // Only return supported vector store types
    if (storeType !== 'pinecone' && storeType !== 'supabase') {
      return null;
    }

    return {
      type: storeType,
      config: config.config as Record<string, any>
    };
  } catch (error) {
    console.error('Error getting vector store config:', error);
    return null;
  }
};