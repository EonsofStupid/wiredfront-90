export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "pending" | "sent" | "failed";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  status?: MessageStatus;
  timestamp?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isMinimized: boolean;
  docked: boolean;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

// Props types for components
export interface MessageProps {
  content: string;
  role: MessageRole;
  status?: MessageStatus;
  id?: string;
  timestamp?: string;
  onRetry?: (id: string) => void;
}

export interface ChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}
