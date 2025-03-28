
// Only export the public interface components
// Import from modules for bridge functionality

// Re-export bridge from modules
export { 
  ChatBridgeProvider, 
  useChatBridge 
} from '@/modules/ChatBridge';

// Re-export mode manager from modules
export { 
  ModeProvider, 
  useMode 
} from '@/modules/ModeManager';

// Chat UI components - minimal exports
export { ChatContainer } from './ChatContainer';
export { ChatToggleButton } from './shared/ChatToggleButton';

// Types 
export * from '@/types/chat';
