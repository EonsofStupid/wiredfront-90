import { createClient, type PineconeClient } from '@pinecone-database/pinecone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type VectorStoreType = 'pinecone' | 'weaviate' | 'pgvector';

export interface VectorStoreConfig {
  type: VectorStoreType;
  config: Record<string, any>;
}

let pineconeClient: PineconeClient | null = null;

export const initializePinecone = async () => {
  try {
    const { data: config, error } = await supabase
      .from('vector_store_configs')
      .select('*')
      .eq('store_type', 'pinecone')
      .maybeSingle();

    if (error) throw error;
    if (!config) return null;

    const client = createClient({
      apiKey: config.config.apiKey as string,
      environment: config.config.environment as string,
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

    return {
      type: config.store_type,
      config: config.config
    };
  } catch (error) {
    console.error('Error getting vector store config:', error);
    return null;
  }
};