
// Forward exports to the new module structure
// This file is kept for backward compatibility

import { 
  ChatBridge, 
  ChatBridgeProvider, 
  useChatBridge 
} from '@/modules/ChatBridge';

export { 
  ChatBridge, 
  ChatBridgeProvider, 
  useChatBridge 
};

// Import legacy hooks for backward compatibility 
import { useMessageStore } from './messaging/MessageManager';
import { useChatStore } from './store/chatStore';

export { 
  useMessageStore,
  useChatStore as useSessionStore 
};

// Deprecated: The static methods of this class are no longer recommended.
// Use the instance methods from useChatBridge() instead.
export class ChatBridgeStatic {
  static openChat() {
    console.warn('ChatBridgeStatic.openChat is deprecated. Use useChatBridge().openChat instead.');
    ChatBridge.prototype.openChat.call(null);
  }
  
  static closeChat() {
    console.warn('ChatBridgeStatic.closeChat is deprecated. Use useChatBridge().closeChat instead.');
    ChatBridge.prototype.closeChat.call(null);
  }
  
  static toggleChat() {
    console.warn('ChatBridgeStatic.toggleChat is deprecated. Use useChatBridge().toggleChat instead.');
    ChatBridge.prototype.toggleChat.call(null);
  }
}
