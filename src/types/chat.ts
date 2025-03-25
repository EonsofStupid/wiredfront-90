import { Json } from "@/integrations/supabase/types";

export type MessageStatus = "pending" | "sent" | "failed" | "error" | "cached";
export type MessageRole = "user" | "assistant" | "system";
export type ChatMode =
  | "chat"
  | "dev"
  | "image"
  | "training"
  | "planning"
  | "code";

export interface Message {
  id: string;
  session_id?: string;
  user_id: string;
  role: MessageRole;
  content: string;
  metadata: Json;
  status: MessageStatus;
  retry_count: number;
  last_retry?: string;
  created_at: string;
  updated_at: string;
  parent_message_id?: string;
  last_edited?: string;
  position_order: number;
}
