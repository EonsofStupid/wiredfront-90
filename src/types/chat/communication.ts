
import { ChatMode, MessageRole, MessageType } from './enums';

/**
 * Provider types supported by the system
 */
export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Gemini = 'gemini',
  HuggingFace = 'huggingface',
  AzureOpenAI = 'azure_openai',
  Cohere = 'cohere',
  LLaMA = 'llama',
  Ollama = 'ollama',
  Custom = 'custom'
}

/**
 * Vector database types supported by the system
 */
export enum VectorDbType {
  Pinecone = 'pinecone',
  Weaviate = 'weaviate',
  Qdrant = 'qdrant',
  Milvus = 'milvus',
  Supabase = 'supabase',
  ChromaDB = 'chromadb',
  Faiss = 'faiss'
}

/**
 * Task types supported by the system
 * These values must be aligned with the TaskType in chat/enums.ts
 */
export enum TaskType {
  Chat = 'chat',
  Generation = 'generation',
  Completion = 'completion',
  Summarization = 'summarization',
  Translation = 'translation',
  Analysis = 'analysis',
  Extraction = 'extraction',
  Classification = 'classification',
  StructuredOutput = 'structured_output',
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation',
  QuestionAnswering = 'question_answering',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  Transformation = 'transformation',
  Recommendation = 'recommendation',
  Conversation = 'conversation', // Alias for 'chat' for backward compatibility
  Other = 'other'
}

/**
 * Message envelope for sending to AI providers
 */
export interface MessageEnvelope {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  metadata?: Record<string, any>;
  traceId?: string;
  sessionId?: string;
  userId?: string;
  timestamp?: string;
  mode?: ChatMode;
  systemInstructions?: string[];
  contextStrategy?: string;
  maxTokens?: number;
  temperature?: number;
  tools?: any[];
  isStreaming?: boolean;
  model?: string;
}

/**
 * Response envelope from AI providers
 */
export interface ResponseEnvelope {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  metadata: Record<string, any>;
  finishReason?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  error?: {
    message: string;
    type: string;
    code?: string;
    param?: string;
  };
  traceId?: string;
  sessionId?: string;
  timestamp: string;
  model?: string;
  provider?: string;
}
