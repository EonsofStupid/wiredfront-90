
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

export interface ChatStyles {
  container: string;
  button: string;
  icon: string;
  animation: string;
}

// Add this for clarity on what styling is being used
export type ChatIconStyle = "default" | "wfpulse" | "retro" | "basic";
