import { Database } from "@/integrations/supabase/types";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

export interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}