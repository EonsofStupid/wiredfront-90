
import { z } from 'zod';
import { Json } from '@/integrations/supabase/types';

// Define non-recursive metadata schema to avoid deep type instantiation
export const messageMetadataSchema = z.object({
  model: z.string().optional(),
  tokens: z.object({
    prompt: z.number().default(0),
    completion: z.number().default(0),
    total: z.number().default(0)
  }).optional(),
  processing: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    duration: z.number().optional()
  }).optional()
}).catchall(z.unknown()); // Allow additional properties with unknown type

export const messageRoleSchema = z.enum(['user', 'assistant', 'system']);
export const messageTypeSchema = z.enum(['text', 'command', 'system', 'image']);
export const messageStatusSchema = z.enum(['pending', 'sent', 'failed', 'error', 'cached', 'received']);

// Main message schema with explicit types to avoid recursion
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  user_id: z.string().nullable(),
  type: messageTypeSchema,
  metadata: messageMetadataSchema.default({}),
  created_at: z.string(),
  updated_at: z.string(),
  chat_session_id: z.string(),
  is_minimized: z.boolean().default(false),
  position: z.any(), // Using z.any() to avoid recursion with Json type
  window_state: z.any(), // Using z.any() to avoid recursion with Json type
  last_accessed: z.string(),
  retry_count: z.number().default(0),
  message_status: messageStatusSchema,
  role: messageRoleSchema,
  source_type: z.string().optional(),
  provider: z.string().optional(),
  processing_status: z.string().optional(),
  last_retry: z.string().optional(),
  rate_limit_window: z.string().optional(),
});

// Create TypeScript types from Zod schemas
export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MessageRole = z.infer<typeof messageRoleSchema>;
export type MessageType = z.infer<typeof messageTypeSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type Message = z.infer<typeof messageSchema>;

// Message request and response schemas
export const messageRequestSchema = z.object({
  content: z.string(),
  sessionId: z.string().optional(),
  mode: z.string().optional(),
  metadata: messageMetadataSchema.optional(),
});

export const messageResponseSchema = z.object({
  success: z.boolean(),
  message: messageSchema.optional(),
  error: z.unknown().optional(),
});

export type MessageRequest = z.infer<typeof messageRequestSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;

// Utility function to validate messages
export const validateMessage = (data: unknown): Message | null => {
  try {
    return messageSchema.parse(data);
  } catch (error) {
    console.error('Message validation failed:', error);
    return null;
  }
};

// Utility function to create a new message with defaults
export const createMessage = (
  partial: Partial<Message> & { id: string; content: string; role: MessageRole }
): Message => {
  const now = new Date().toISOString();
  
  const defaultMessage: Message = {
    id: partial.id,
    content: partial.content,
    role: partial.role,
    user_id: null,
    type: 'text',
    metadata: {},
    created_at: now,
    updated_at: now,
    chat_session_id: '',
    is_minimized: false,
    position: {},
    window_state: {},
    last_accessed: now,
    retry_count: 0,
    message_status: 'sent',
  };
  
  return { ...defaultMessage, ...partial };
};
