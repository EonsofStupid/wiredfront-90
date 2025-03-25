
import { Message, MessageRole, MessageStatus } from '@/types/chat';

// Defining the different chat modes
export type ChatMode = 'chat' | 'developer' | 'image' | 'training' | 'dev';

// Message interface specific to the bridge
export interface BridgeMessage extends Omit<Message, 'type'> {
  processing?: boolean;
  error?: string;
  type?: 'text' | 'command' | 'system' | 'image' | 'training';
}

// Event types for the bridge
export type BridgeEventType = 
  | 'message:send'
  | 'message:receive'
  | 'message:update'
  | 'mode:change'
  | 'settings:update'
  | 'connection:change'
  | 'error';

// Event structure for the bridge
export interface BridgeEvent {
  type: BridgeEventType;
  payload: any;
  timestamp: number;
}

// Listener function type
export type BridgeListener = (event: BridgeEvent) => void;

// Connection status
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Settings interface
export interface BridgeSettings {
  mode: ChatMode;
  providers: {
    [key: string]: boolean;
  };
  appearance: {
    position: 'bottom-right' | 'bottom-left';
    buttonStyle: string;
    buttonSize: 'small' | 'medium' | 'large';
    buttonColor: string;
  };
  notifications: {
    sound: boolean;
    desktop: boolean;
  };
  chatWidth: number;
  chatHeight: number;
}
