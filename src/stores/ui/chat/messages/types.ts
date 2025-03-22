// Basic message types
export interface Message {
  id: string;
  content: string;
  timestamp: number;
  type: "user" | "assistant";
  status?: "sending" | "sent" | "error";
  metadata?: {
    projectId?: string;
    mode?: string;
    sessionId?: string;
  };
}
