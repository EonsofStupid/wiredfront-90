
/**
 * Task types for different chat operations
 */
export enum TaskType {
  // General conversation tasks
  Conversation = 'conversation',
  DocumentSearch = 'document_search',
  
  // Code-related tasks
  CodeGeneration = 'code_generation',
  CodeExplanation = 'code_explanation',
  BugFix = 'bug_fix',
  CodeReview = 'code_review',
  Refactoring = 'refactoring',
  ProjectContext = 'project_context',
  
  // Image-related tasks
  ImageGeneration = 'image_generation',
  ImageEditing = 'image_editing',
  
  // Training-related tasks
  Tutoring = 'tutoring',
  ProblemSolving = 'problem_solving',
  Explanation = 'explanation',
  
  // Admin and system tasks
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation'
}

/**
 * Message routing information
 */
export interface MessageRoute {
  destination: string;
  priority?: 'high' | 'normal' | 'low';
  ttl?: number; // Time to live in seconds
}

/**
 * Chat event definition
 */
export interface ChatEvent {
  type: string;
  timestamp: string;
  data: any;
  source?: string;
}

/**
 * Chat notification definition
 */
export interface ChatNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Provider type enum
 */
export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Gemini = 'gemini',
  HuggingFace = 'huggingface',
  Mistral = 'mistral',
  Custom = 'custom'
}

/**
 * Vector database type enum
 */
export enum VectorDbType {
  Pinecone = 'pinecone',
  Weaviate = 'weaviate',
  Supabase = 'supabase',
  Qdrant = 'qdrant',
  Milvus = 'milvus',
  Custom = 'custom'
}

/**
 * Message envelope for sending to LLM services
 */
export interface MessageEnvelope {
  id: string;
  sessionId: string;
  userId: string;
  content: string | string[];
  role: string;
  timestamp: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  mode?: string;
  taskType?: TaskType;
  provider?: string;
  model?: string;
}

/**
 * Response envelope from LLM services
 */
export interface ResponseEnvelope {
  id: string;
  sessionId: string;
  content: string;
  role: string;
  timestamp: string;
  metadata?: Record<string, any>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
