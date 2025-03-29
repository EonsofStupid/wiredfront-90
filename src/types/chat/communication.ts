
import { ChatMode, MessageRole, MessageStatus, MessageType } from './enums';
import { Provider } from '@/components/chat/types/provider-types';

/**
 * Task types for AI operations
 */
export enum TaskType {
  // Core task types
  Chat = 'chat',
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
  
  // Admin and system task types
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation',
  
  // Specific AI task types
  QuestionAnswering = 'question_answering',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  
  // Extended task types for specific applications
  CodeExplanation = 'code_explanation',
  BugFix = 'bug_fix',
  CodeReview = 'code_review',
  Refactoring = 'refactoring',
  ProjectContext = 'project_context',
  ImageEditing = 'image_editing',
  DocumentSearch = 'document_search',
  Tutoring = 'tutoring',
  ProblemSolving = 'problem_solving',
  Explanation = 'explanation',
  
  // Legacy and fallback
  Conversation = 'conversation', // Alias for Chat for backward compatibility
  Other = 'other'
}

/**
 * Message envelope for AI service communication
 */
export interface MessageEnvelope {
  id: string;
  model: string;
  messages: Array<{
    role: MessageRole;
    content: string;
    name?: string;
    function_call?: any;
  }>;
  user?: string;
  timestamp: number;
  conversationId?: string;
  systemPrompt?: string;
  stream?: boolean;
  mode?: ChatMode;
  taskType?: TaskType;
  sessionId?: string;
  input?: string;
  temperature?: number;
  maxTokens?: number;
  fallbackLevel?: number;
  adminFlags?: Record<string, boolean>;
}

/**
 * Response envelope from AI service
 */
export interface ResponseEnvelope {
  id: string;
  model: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  error?: string;
  provider?: string;
  completionTokens?: number;
  promptTokens?: number;
  totalTokens?: number;
  traceId?: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
    input?: number;
    output?: number;
  };
  processingTimeMs?: number;
  cacheInfo?: {
    hit: boolean;
    key: string;
    cacheHit?: boolean;
    cacheTier?: string;
  };
  vectorInfo?: {
    used: boolean;
    count: number;
    sources: string[];
    searchPerformed?: boolean;
    chunksRetrieved?: number;
    vectorDb?: string;
  };
  fallbacksUsed?: string[];
  fineTuneMetadata?: {
    version: string;
    params: Record<string, any>;
    markedForFineTune?: boolean;
    quality?: number;
  };
}

// Re-export TaskType for use in other modules
export { TaskType };
