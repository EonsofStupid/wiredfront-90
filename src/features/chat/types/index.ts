
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { Json } from '@/integrations/supabase/types';

// Basic enums
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'failed';
export type MessageType = 'text' | 'system' | 'command';
export type ChatPosition = 'bottom-right' | 'bottom-left';
export type ChatMode = 'standard' | 'editor' | 'chat-only';
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type FileType = 'image' | 'document' | 'code' | 'other';

// Zod validation schemas
export const FileTypeSchema = z.enum(['image', 'document', 'code', 'other']);
export const FileStatusSchema = z.enum(['uploading', 'processing', 'ready', 'error']);
export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);
export const MessageStatusSchema = z.enum(['pending', 'sent', 'failed']);
export const MessageTypeSchema = z.enum(['text', 'system', 'command']);
export const ChatPositionSchema = z.enum(['bottom-right', 'bottom-left']);
export const ChatModeSchema = z.enum(['standard', 'editor', 'chat-only']);

// File metadata validation
export const FileMetadataSchema = z.object({
  contentType: z.string().optional(),
  dimensions: z.object({ width: z.number(), height: z.number() }).optional(),
  encoding: z.string().optional(),
  extension: z.string().optional(),
  language: z.string().optional(), // For code files
  description: z.string().optional(),
}).catchall(z.unknown());

// File validation with size limits
export const ChatSessionFileSchema = z.object({
  id: z.string(),
  session_id: z.string(),
  name: z.string().max(255),
  type: FileTypeSchema,
  url: z.string().url(),
  size: z.number().max(10 * 1024 * 1024), // 10MB max file size
  status: FileStatusSchema,
  uploaded_at: z.string(),
  metadata: FileMetadataSchema.optional(),
});

// Chat session metadata validation
export const ChatSessionMetadataSchema = z.object({
  context: z.string().optional(),
  summary: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  references: z.array(z.string()).max(100).optional(),
  codebase_context: z.record(z.unknown()).optional(),
  github_context: z.record(z.unknown()).optional(),
  custom_data: z.record(z.unknown()).optional(),
});

// Create a Zod schema for Json type that matches Supabase's Json type
export const JsonSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.lazy(() => z.record(JsonSchema)),
  z.lazy(() => z.array(JsonSchema))
]);

// Message validation
export const MessageSchema = z.object({
  id: z.string(),
  content: z.string().max(50000), // Setting reasonable content size limit
  role: MessageRoleSchema,
  user_id: z.string(),
  chat_session_id: z.string().nullable(),
  message_status: MessageStatusSchema,
  type: MessageTypeSchema,
  metadata: JsonSchema.default({}), // Using the JsonSchema to match Supabase's Json type
  timestamp: z.string(),
  is_minimized: z.boolean().optional(),
});

// Chat session validation
export const ChatSessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  last_accessed: z.string(),
  title: z.string().max(100).optional(),
  files: z.array(ChatSessionFileSchema).max(50).optional(), // Limit to 50 files per session
  metadata: ChatSessionMetadataSchema.optional(),
});

// Type definitions based on Zod schemas
export type Message = z.infer<typeof MessageSchema>;

export type ChatSessionFile = z.infer<typeof ChatSessionFileSchema>;

export type ChatSessionMetadata = z.infer<typeof ChatSessionMetadataSchema>;

export type ChatSession = z.infer<typeof ChatSessionSchema>;

// Other non-validated types
export interface ChatFeatures {
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  notifications: boolean;
  voiceInput: boolean;
  voiceOutput: boolean;
}

export interface ChatUIState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
}

export interface ChatProviderInfo {
  id: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama';
  name: string;
  isEnabled: boolean;
  isDefault?: boolean;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface SessionState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Utility functions for validation
export const validateMessage = (message: unknown): Message => {
  return MessageSchema.parse(message);
};

export const validateChatSession = (session: unknown): ChatSession => {
  return ChatSessionSchema.parse(session);
};

export const validateChatSessionFile = (file: unknown): ChatSessionFile => {
  return ChatSessionFileSchema.parse(file);
};

export const validateChatSessionMetadata = (metadata: unknown): ChatSessionMetadata => {
  return ChatSessionMetadataSchema.parse(metadata);
};
