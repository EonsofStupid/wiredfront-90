
import type { MessageRole, MessageStatus } from "@/types/chat";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  status: MessageStatus;
  timestamp?: string;
}

export interface ChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}
