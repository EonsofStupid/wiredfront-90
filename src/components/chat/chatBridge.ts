
// Forward exports to the new module structure
// This file is kept for backward compatibility

import { 
  ChatBridge, 
  useChatBridge 
} from '@/modules/ChatBridge';

export { 
  ChatBridge,
  useChatBridge 
};

// Import legacy hooks for backward compatibility 
import { useMessageStore } from './messaging/MessageManager';
import { useChatStore } from './store/chatStore';

export { 
  useMessageStore,
  useChatStore as useSessionStore 
};
