export interface ChatProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 
    'weaviate' | 'openrouter' | 'replicate' | 'sonnet' | 'elevenlabs' | 'whisper' | 'github';
  isEnabled: boolean;
  isDefault: boolean;
  apiReference: string;
  config?: Record<string, any>;
  lastUsed?: Date;
  usage?: {
    totalTokens: number;
    totalQueries: number;
    lastUsed: Date;
  };
} 