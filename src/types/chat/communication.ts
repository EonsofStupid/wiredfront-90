
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
  Explanation = 'explanation'
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
