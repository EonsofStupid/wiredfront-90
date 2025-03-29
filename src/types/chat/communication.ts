
import { ChatMode, MessageRole, MessageType, TaskType } from './enums';

/**
 * Provider type enum (for communication with APIs)
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
  Replicate = 'replicate',
  StabilityAI = 'stabilityai',
  Custom = 'custom'
}

/**
 * Vector database type enum
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
 * Basic message envelope structure 
 */
export interface MessageEnvelope {
  id: string;
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
    [key: string]: any;
  };
  task: TaskType;
  metadata?: Record<string, any>;
  traceId?: string;
}

/**
 * Response envelope from AI providers
 */
export interface ResponseEnvelope {
  id: string;
  content: string;
  model: string;
  provider?: string;
  usage: {
    total: number;
    prompt: number;
    completion: number;
    input?: number;
    output?: number;
  };
  rag: {
    used: boolean;
    count: number;
    sources: string[];
    searchPerformed?: boolean;
    chunksRetrieved?: number;
    vectorDb?: string;
  };
  cache: {
    hit: boolean;
    key: string;
    cacheHit?: boolean;
    cacheTier?: string | null;
  };
  context: string[];
  model_info: {
    version: string;
    params: Record<string, any>;
    markedForFineTune?: boolean;
    quality?: number | string;
  };
  created: number;
  latency: number;
  metadata?: Record<string, any>;
}

/**
 * Extended task types for specific use cases
 */
export enum ExtendedTaskType {
  Chat = 'chat',
  CodeExplanation = 'code_explanation',
  BugFix = 'bug_fix',
  CodeReview = 'code_review',
  Refactoring = 'refactoring',
  Tutoring = 'tutoring',
  ProblemSolving = 'problem_solving',
  Explanation = 'explanation',
  ImageEditing = 'image_editing',
  DocumentSearch = 'document_search',
  ProjectContext = 'project_context'
}
