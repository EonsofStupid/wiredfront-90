
import { Message, MessageRole, MessageStatus } from '@/types/chat';

export interface MessageProcessingOptions {
  priority: 'high' | 'normal' | 'low';
  retryCount: number;
  maxRetries: number;
  timeout: number;
}

export interface MessageQueueItem {
  message: Message;
  options: MessageProcessingOptions;
  timestamp: string;
  attempts: number;
  lastAttempt: string | null;
}

export interface MessageQueueState {
  queue: MessageQueueItem[];
  processingMessage: string | null;
  isProcessing: boolean;
  isPaused: boolean;
  error: string | null;
}

export interface MessageQueueMetrics {
  totalProcessed: number;
  totalFailed: number;
  averageProcessingTime: number;
  queuedMessages: number;
}

export interface MessageQueueActions {
  enqueueMessage: (message: Message, options?: Partial<MessageProcessingOptions>) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  dequeueMessage: (id: string) => void;
  processNextMessage: () => Promise<void>;
  pauseQueue: () => void;
  resumeQueue: () => void;
  clearQueue: () => void;
  retryMessage: (id: string) => Promise<void>;
  getQueueMetrics: () => MessageQueueMetrics;
}

export type MessageQueue = MessageQueueState & MessageQueueActions;

export interface MessageStorageState {
  messages: Record<string, Message>;
  isLoading: boolean;
  error: string | null;
}

export interface MessageStorageActions {
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  getMessages: (sessionId: string) => Message[];
  clearSessionMessages: (sessionId: string) => void;
  clearAllMessages: () => void;
  importMessages: (messages: Message[]) => void;
  searchMessages: (query: string, sessionId?: string) => Message[];
}

export type MessageStorage = MessageStorageState & MessageStorageActions;
