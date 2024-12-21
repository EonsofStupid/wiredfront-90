import { Database } from "@/integrations/supabase/types";

export type MessageBehavior = Database["public"]["Enums"]["message_behavior_type"];
export type ChatAPIProvider = Database["public"]["Enums"]["chat_api_provider"];

export interface UICustomizations {
  chatbot_name: string;
  avatar_url: string | null;
  placeholder_text: string;
  theme: string;
}

export interface ChatSettings {
  enabled: boolean;
  message_behavior: MessageBehavior;
  ui_customizations: UICustomizations;
}