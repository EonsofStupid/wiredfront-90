
import { toast } from 'sonner';
import { useConversationStore } from './store/conversation/store';
import { useMessageStore } from './messaging/MessageManager';
import { useChatStore } from './store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { Message, MessageRole, MessageType, MessageStatus } from '@/types/chat';
import { Json } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * ChatBridge is the central communication layer between the app and the chat client.
 * All interactions with the chat should go through this bridge.
 */
export class ChatBridge {
  /**
   * Sends a message to the chat
   */
  static sendMessage(content: string, options: {
    role?: MessageRole;
    type?: MessageType;
    metadata?: Record<string, any>;
  } = {}) {
    const messageStore = useMessageStore.getState();
    const conversationStore = useConversationStore.getState();
    const chatStore = useChatStore.getState();
    
    // Default options
    const { 
      role = 'user',
      type = 'text',
      metadata = {}
    } = options;
    
    try {
      // Make sure we have a conversation
      let conversationId = conversationStore.currentConversationId;
      
      if (!conversationId) {
        // Create a new conversation if needed
        conversationId = conversationStore.createConversation({
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          metadata: {
            mode: chatStore.currentMode,
            providerId: chatStore.currentProvider?.id
          }
        }) as unknown as string;
        
        if (!conversationId) {
          throw new Error('Failed to create conversation');
        }
      }
      
      const now = new Date().toISOString();
      
      // Create the message
      const message: Message = {
        id: uuidv4(),
        role,
        content,
        type,
        user_id: null, // Will be filled by the server
        metadata: metadata as Json,
        created_at: now,
        updated_at: now,
        conversation_id: conversationId,
        chat_session_id: conversationId, // For backward compatibility
        is_minimized: false,
        position: {} as Json,
        window_state: {} as Json,
        last_accessed: now,
        retry_count: 0,
        message_status: 'sent'
      };
      
      // Add the message to the store
      messageStore.addMessage(message);
      
      // Log the action
      logger.info('Message sent through ChatBridge', { 
        conversationId, 
        role, 
        type,
        messageId: message.id,
        contentLength: content.length
      });
      
      return message.id;
    } catch (error) {
      logger.error('Failed to send message through ChatBridge', { error });
      toast.error('Failed to send message');
      return null;
    }
  }
  
  /**
   * Creates a new conversation
   */
  static createConversation(options: {
    title?: string;
    metadata?: Record<string, any>;
  } = {}) {
    const conversationStore = useConversationStore.getState();
    const chatStore = useChatStore.getState();
    
    try {
      // Add chat store context to metadata
      const metadata = {
        ...options.metadata,
        mode: chatStore.currentMode,
        providerId: chatStore.currentProvider?.id
      };
      
      return conversationStore.createConversation({
        title: options.title,
        metadata
      });
    } catch (error) {
      logger.error('Failed to create conversation through ChatBridge', { error });
      toast.error('Failed to create conversation');
      return null;
    }
  }
  
  /**
   * Switches to a different conversation
   */
  static switchConversation(conversationId: string) {
    const conversationStore = useConversationStore.getState();
    const messageStore = useMessageStore.getState();
    
    try {
      // Set the current conversation
      conversationStore.setCurrentConversationId(conversationId);
      
      // Fetch messages for this conversation
      messageStore.fetchSessionMessages(conversationId);
      
      logger.info('Switched conversation through ChatBridge', { conversationId });
      return true;
    } catch (error) {
      logger.error('Failed to switch conversation through ChatBridge', { error, conversationId });
      toast.error('Failed to switch conversation');
      return false;
    }
  }
  
  /**
   * Archives a conversation
   */
  static archiveConversation(conversationId: string) {
    const conversationStore = useConversationStore.getState();
    
    try {
      return conversationStore.archiveConversation(conversationId);
    } catch (error) {
      logger.error('Failed to archive conversation through ChatBridge', { error, conversationId });
      toast.error('Failed to archive conversation');
      return false;
    }
  }
  
  /**
   * Deletes a conversation
   */
  static deleteConversation(conversationId: string) {
    const conversationStore = useConversationStore.getState();
    
    try {
      return conversationStore.deleteConversation(conversationId);
    } catch (error) {
      logger.error('Failed to delete conversation through ChatBridge', { error, conversationId });
      toast.error('Failed to delete conversation');
      return false;
    }
  }
  
  /**
   * Updates chat settings
   */
  static updateChatSettings(settings: Record<string, any>) {
    const chatStore = useChatStore.getState();
    
    try {
      // For now, this is a simple pass-through to the chat store
      // In the future, this can handle more complex logic
      
      if (settings.currentMode && typeof settings.currentMode === 'string') {
        chatStore.setSelectedMode(settings.currentMode);
      }
      
      if (settings.selectedModel && typeof settings.selectedModel === 'string') {
        chatStore.setSelectedModel(settings.selectedModel);
      }
      
      logger.info('Updated chat settings through ChatBridge', { settings });
      return true;
    } catch (error) {
      logger.error('Failed to update chat settings through ChatBridge', { error });
      toast.error('Failed to update chat settings');
      return false;
    }
  }
}

// Create hooks for accessing ChatBridge methods in components
export const useChatBridge = () => {
  return {
    sendMessage: ChatBridge.sendMessage,
    createConversation: ChatBridge.createConversation,
    switchConversation: ChatBridge.switchConversation,
    archiveConversation: ChatBridge.archiveConversation,
    deleteConversation: ChatBridge.deleteConversation,
    updateChatSettings: ChatBridge.updateChatSettings
  };
};
