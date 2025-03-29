
import { ChatMode, MessageRole, MessageType, TaskType } from './chat/enums';

/**
 * Communication request interface
 */
export interface CommunicationRequest {
  id: string;
  mode: ChatMode;
  content: string;
  taskType: TaskType;
  role: MessageRole;
  messageType?: MessageType;
  conversationId?: string;
  modelId?: string;
  providerId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Communication response interface
 */
export interface CommunicationResponse {
  id: string;
  requestId: string;
  content: string;
  role: MessageRole;
  messageType: MessageType;
  status: 'success' | 'error' | 'partial' | 'stream';
  timestamp: number;
  metadata?: Record<string, any>;
  error?: string;
}

/**
 * Message stream chunk interface
 */
export interface MessageStreamChunk {
  id: string;
  requestId: string;
  content: string;
  isDone: boolean;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Communication error interface
 */
export interface CommunicationError {
  code: string;
  message: string;
  details?: any;
}

/**
 * AI model capabilities
 */
export interface ModelCapabilities {
  maxTokens: number;
  supportedMessageTypes: MessageType[];
  supportedTaskTypes: TaskType[];
  features: string[];
  streaming: boolean;
}

/**
 * Model settings interface
 */
export interface ModelSettings {
  temperature: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}
