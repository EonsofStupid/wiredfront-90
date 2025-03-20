export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  error?: string;
}

export interface MessagesState {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
}

export interface MessagesActions {
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
}
