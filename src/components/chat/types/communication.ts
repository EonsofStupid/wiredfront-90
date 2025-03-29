
import { ChatMode, MessageRole, MessageStatus, MessageType, TaskType } from './chat/enums';

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
