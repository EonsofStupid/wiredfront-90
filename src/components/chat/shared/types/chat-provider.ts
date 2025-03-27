
export interface ChatProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 
    'weaviate' | 'openrouter' | 'replicate' | 'sonnet' | 'elevenlabs' | 'whisper' | 'github' | 'stabilityai';
  isEnabled: boolean;
  isDefault: boolean;
  apiReference: string;
  category?: 'chat' | 'image' | 'integration';
  config?: Record<string, unknown>;
  lastUsed?: Date;
  usage?: {
    totalTokens: number;
    totalQueries: number;
    lastUsed: Date;
  };
} 
