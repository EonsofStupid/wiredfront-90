
// Import types directly from the main types file
import type { Session, SessionOperationResult, CreateSessionParams, UpdateSessionParams } from '@/types/sessions';

// Export these types for local usage to avoid circular references
export type { 
  Session, 
  SessionOperationResult, 
  CreateSessionParams, 
  UpdateSessionParams 
};
