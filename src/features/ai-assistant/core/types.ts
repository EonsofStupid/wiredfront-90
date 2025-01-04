export interface AIAssistantConfig {
  enabled: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isMinimized: boolean;
}

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export interface AIAssistantState {
  config: AIAssistantConfig;
  messages: AIMessage[];
  isInitialized: boolean;
}