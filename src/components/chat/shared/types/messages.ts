
import { MessageRole, MessageStatus, MessageType, MessageMetadata } from '../schemas/messages';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  chat_session_id: string;
  created_at: string;
  updated_at: string;
  message_status: MessageStatus;
  metadata: MessageMetadata;
}

export interface MessageRequest {
  content: string;
  sessionId?: string;
  mode?: string;
  metadata?: MessageMetadata;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: Error;
}
