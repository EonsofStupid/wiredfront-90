import { Database } from "@/integrations/supabase/types";
import { APISettingsState } from "@/types/store/settings/api";
import { Json } from "@/integrations/supabase/types";

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

export interface UseAPISettingsReturn {
  settings: APISettingsState;
  updateSetting: (key: keyof APISettingsState, value: string) => void;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  user: any;
}

export interface SettingValue {
  key: string;
}

export function isSettingValue(value: unknown): value is SettingValue {
  return (
    typeof value === 'object' && 
    value !== null && 
    'key' in value && 
    typeof (value as SettingValue).key === 'string'
  );
}