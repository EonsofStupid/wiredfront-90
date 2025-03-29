
import { TaskType } from './enums';

/**
 * Provider types enum
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
 * Vector database types enum
 */
export enum VectorDbType {
  Pinecone = 'pinecone',
  Weaviate = 'weaviate',
  Qdrant = 'qdrant',
  Milvus = 'milvus',
  Supabase = 'supabase',
  ChromaDB = 'chromadb',
  Faiss = 'faiss',
  Custom = 'custom'
}

/**
 * Extended task types (for internal code organization)
 */
export enum ExtendedTaskType {
  // Standard task types from the main enum
  Chat = TaskType.Chat,
  Conversation = TaskType.Conversation,
  Generation = TaskType.Generation,
  Completion = TaskType.Completion,
  Summarization = TaskType.Summarization,
  Translation = TaskType.Translation,
  Analysis = TaskType.Analysis,
  Extraction = TaskType.Extraction,
  Classification = TaskType.Classification,
  Transformation = TaskType.Transformation,
  Recommendation = TaskType.Recommendation,
  StructuredOutput = TaskType.StructuredOutput,
  AdminQuery = TaskType.AdminQuery,
  SystemDiagnostic = TaskType.SystemDiagnostic,
  CacheQuery = TaskType.CacheQuery,
  VectorIndex = TaskType.VectorIndex,
  ModelValidation = TaskType.ModelValidation,
  QuestionAnswering = TaskType.QuestionAnswering,
  ImageGeneration = TaskType.ImageGeneration,
  CodeGeneration = TaskType.CodeGeneration,
  Other = TaskType.Other,
  
  // Extended task types for more granular operations
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
  };
  processingTimeMs?: number;
  fallbacksUsed?: string[];
  vectorInfo?: {
    used: boolean;
    count: number;
    sources: string[];
  };
  cacheInfo?: {
    hit: boolean;
    key: string;
  };
  fineTuneMetadata?: {
    version: string;
    params: Record<string, any>;
  };
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
