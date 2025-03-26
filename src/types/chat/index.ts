
// Basic chat message types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  timestamp: string;
  status?: 'sending' | 'sent' | 'failed' | 'received';
  metadata?: Record<string, any>;
}

// Connection state for websocket 
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

// Chat position for UI
export type ChatPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'right-sidebar' | 'left-sidebar';

// Chat UI state
export interface ChatUIState {
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  isDocked: boolean;
  scale: number;
  showSidebar: boolean;
  isChatLoaded: boolean;
  isChatInitialized: boolean;
  sessionLoading: boolean;
  messageLoading: boolean;
}

// Message types
export type MessageType = 'text' | 'image' | 'code' | 'file' | 'system' | 'notification';

// Chat modes
export type ChatMode = 'standard' | 'editor' | 'image' | 'training' | 'documentation';
