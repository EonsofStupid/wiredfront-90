
import { 
  Message, 
  MessageCreateParams, 
  MessageUpdateParams 
} from './chat/message';
import { 
  MessageRole, 
  MessageStatus, 
  MessageType 
} from './chat/enums';

// Re-export message-related types
export type { 
  Message, 
  MessageCreateParams, 
  MessageUpdateParams 
};

// Re-export message-related enums
export { MessageRole, MessageStatus, MessageType };
