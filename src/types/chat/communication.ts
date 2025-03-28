
import { ChatMode } from './enums';

/**
 * Task types that can be handled by the orchestrator
 */
export enum TaskType {
  // General tasks
  Conversation = 'conversation',
  
  // Development mode tasks
  CodeGeneration = 'code_gen',
  CodeExplanation = 'code_explain',
  BugFix = 'bug_fix',
  CodeReview = 'code_review',
  Refactoring = 'refactoring',
  
  // Training mode tasks
  Tutoring = 'tutoring',
  ProblemSolving = 'problem_solving',
  Explanation = 'explanation',
  
  // Image mode tasks
  ImageGeneration = 'image_gen',
  ImageEditing = 'image_edit',
  
  // RAG tasks
  DocumentSearch = 'doc_search',
  ProjectContext = 'project_context',
  
  // Admin tasks
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  
  // Orchestration tasks
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation'
}

/**
 * Priority levels for task processing
 */
export enum TaskPriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Critical = 'critical'
}

/**
 * Standard message envelope for all communications with the orchestrator
 */
export interface MessageEnvelope {
  // Tracing and session info
  traceId: string;
  sessionId: string;
  
  // Context and mode
  mode: ChatMode;
  taskType: TaskType;
  
  // Content
  input: string;
  context?: string[];
  systemPrompt?: string;
  
  // Processing options
  apiKeyOverride?: string;
  fallbackLevel?: number;
  maxTokens?: number;
  temperature?: number;
  priority?: TaskPriority;
  
  // Admin flags
  adminFlags?: {
    safeMode?: boolean;
    logFineTuneReady?: boolean;
    bypassCache?: boolean;
    bypassVectorSearch?: boolean;
  };
  
  // Metadata
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Response envelope from the orchestrator
 */
export interface ResponseEnvelope {
  traceId: string;
  sessionId: string;
  taskType: TaskType;
  
  // Content
  output: string;
  
  // Processing info
  model: string;
  provider: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  
  // Vector search info
  vectorInfo?: {
    searchPerformed: boolean;
    chunksRetrieved: number;
    vectorDb: string;
    searchLatencyMs?: number;
  };
  
  // Cache info
  cacheInfo?: {
    cacheHit: boolean;
    cacheTier: 'memory' | 'disk' | 'distributed' | null;
    similarityScore?: number;
  };
  
  // Metadata
  processingTimeMs: number;
  timestamp: string;
  fallbacksUsed?: number;
  error?: string;
  metadata?: Record<string, any>;
  
  // Fine-tuning flags
  fineTuneMetadata?: {
    markedForFineTune: boolean;
    quality: 'high' | 'medium' | 'low' | null;
    feedback?: string;
  };
}

/**
 * Provider types supported by the orchestrator
 */
export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Gemini = 'gemini',
  Local = 'local',
  Replicate = 'replicate',
  AzureOpenAI = 'azure_openai',
  CustomAPI = 'custom_api'
}

/**
 * Vector database types supported by the orchestrator
 */
export enum VectorDbType {
  Supabase = 'supabase',
  Pinecone = 'pinecone',
  Qdrant = 'qdrant',
  Weaviate = 'weaviate',
  ChromaDB = 'chromadb',
  Local = 'local'
}

/**
 * Model routing configuration for specific task types
 */
export interface ModelRoutingConfig {
  taskType: TaskType;
  fallbackChain: string[]; // Format: "provider:model", e.g. "openai:gpt-4"
  maxTokens?: number;
  temperature?: number;
  cacheTtlSeconds?: number;
  vectorSearchEnabled?: boolean;
}

/**
 * Cache configuration for the orchestrator
 */
export interface OrchestratorCacheConfig {
  enabled: boolean;
  memoryCacheSize: number;
  diskCacheEnabled: boolean;
  diskCachePath: string;
  ttlSeconds: number;
  similarityThreshold: number;
}

/**
 * Orchestrator metrics
 */
export interface OrchestratorMetrics {
  requestsTotal: number;
  requestsSuccess: number;
  requestsFailed: number;
  averageLatencyMs: number;
  cacheHitRate: number;
  tokensUsedTotal: number;
  costUsd: number;
  fallbacksTriggered: number;
}
