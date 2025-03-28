
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
  
  // Processing options
  apiKeyOverride?: string;
  fallbackLevel?: number;
  maxTokens?: number;
  temperature?: number;
  
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
  
  // Metadata
  processingTimeMs: number;
  timestamp: string;
  fallbacksUsed?: number;
  error?: string;
  metadata?: Record<string, any>;
}
