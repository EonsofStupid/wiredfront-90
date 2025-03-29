
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
 * Task types for AI operations
 * Re-exported from the enums file to maintain a single source of truth
 */
export { TaskType } from './enums';

/**
 * Extended task types (for internal code organization)
 * These extend the base TaskType but include more specialized operations
 */
export enum ExtendedTaskType {
  // Standard task types from TaskType enum
  Chat = 'chat',
  Conversation = 'conversation',
  Generation = 'generation',
  Completion = 'completion',
  Summarization = 'summarization',
  Translation = 'translation',
  Analysis = 'analysis',
  Extraction = 'extraction',
  Classification = 'classification',
  Transformation = 'transformation',
  Recommendation = 'recommendation',
  StructuredOutput = 'structured_output',
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation',
  QuestionAnswering = 'question_answering',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  Other = 'other',
  
  // Extended specialized task types
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

/**
 * Message envelope for requests
 */
export interface MessageEnvelope {
  id: string;
  sessionId?: string;
  userId: string;
  messages: any[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  functions?: any[];
  contextInfo?: {
    projectId?: string;
    files?: string[];
    relevanceThreshold?: number;
  };
  metadata?: Record<string, any>;
  
  // Extended fields for the ModelBridge
  taskType?: ExtendedTaskType | TaskType;
  fallbackLevel?: number;
  adminFlags?: Record<string, boolean>;
  input?: string;
  vectorInfo?: Record<string, any>;
  cacheInfo?: Record<string, any>;
  traceId?: string;
}

/**
 * Response envelope for completed requests
 */
export interface ResponseEnvelope {
  id: string;
  sessionId?: string;
  userId: string;
  model: string;
  content: string;
  messages?: any[];
  metadata?: Record<string, any>;
  
  // Extended fields for the ModelBridge
  taskType?: ExtendedTaskType | TaskType;
  tokensUsed?: {
    total: number;
    prompt: number;
    completion: number;
    input?: number;
    output?: number;
  };
  processingTimeMs?: number;
  fallbacksUsed?: string[];
  vectorInfo?: {
    used: boolean;
    count: number;
    sources: string[];
    searchPerformed?: boolean;
    chunksRetrieved?: number;
    vectorDb?: string;
  };
  cacheInfo?: {
    hit: boolean;
    key: string;
    cacheHit?: boolean;
    cacheTier?: string;
  };
  fineTuneMetadata?: {
    version: string;
    params: Record<string, any>;
    markedForFineTune?: boolean;
    quality?: number;
  };
  output?: string;
  provider?: string;
  traceId?: string;
}

/**
 * Error response structure
 */
export interface APIErrorResponse {
  message: string;
  type: string;
  code?: string;
  param?: string;
}
