
import { ChatBridge as ChatBridgeClass } from './ChatBridge';
import { ChatBridgeProvider, useChatBridge } from './ChatBridgeProvider';

// Export everything as named exports
export { 
  ChatBridgeClass as ChatBridge,
  ChatBridgeProvider, 
  useChatBridge 
};

// Types
export * from '@/types/chat/bridge';
