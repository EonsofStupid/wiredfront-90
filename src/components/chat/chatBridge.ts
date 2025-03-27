
import { toast } from 'sonner';
import { useConversationStore } from './store/conversation/store';
import { useMessageStore } from './messaging/MessageManager';
import { useChatStore } from './store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { 
  Message, 
  MessageRole, 
  MessageType, 
  MessageStatus,
  ChatMode, 
  ChatPosition,
  TokenEnforcementMode,
  uiModeToDatabaseMode,
  databaseModeToUiMode,
  isTokenEnforcementMode
} from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';
import { Provider } from './store/types/chat-store-types';
import { v4 as uuidv4 } from 'uuid';
import { MessageCreateParams } from '@/types/chat/message';
import { CreateConversationParams } from '@/types/chat/conversation';

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
        const chatMode = chatStore.currentMode as ChatMode;
        
        conversationId = conversationStore.createConversation({
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          metadata: {
            mode: chatMode,
            providerId: chatStore.currentProvider?.id
          }
        });
        
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
    project_id?: string;
  } = {}) {
    const conversationStore = useConversationStore.getState();
    const chatStore = useChatStore.getState();
    
    try {
      // Get the current chat mode and ensure it's a valid ChatMode
      const currentMode = chatStore.currentMode;
      const chatMode: ChatMode = 
        isChatMode(currentMode) ? currentMode as ChatMode : 'chat';
      
      // Add chat store context to metadata
      const metadata = {
        ...options.metadata,
        mode: chatMode,
        providerId: chatStore.currentProvider?.id
      };
      
      const params: CreateConversationParams = {
        title: options.title,
        metadata,
        project_id: options.project_id
      };
      
      return conversationStore.createConversation(params);
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
        // Map UI mode to database mode if needed
        const mode = settings.currentMode in uiModeToDatabaseMode ? 
          uiModeToDatabaseMode[settings.currentMode] : 
          settings.currentMode;
          
        chatStore.setSelectedMode(mode);
      }
      
      if (settings.selectedModel && typeof settings.selectedModel === 'string') {
        chatStore.setSelectedModel(settings.selectedModel);
      }
      
      if (settings.providers && Array.isArray(settings.providers)) {
        chatStore.updateChatProvider(settings.providers);
      }
      
      if (settings.position && 
         (settings.position === 'bottom-left' || settings.position === 'bottom-right')) {
        chatStore.setPosition(settings.position as ChatPosition);
      }
      
      if (settings.tokenEnforcementMode) {
        const enforcementMode = isTokenEnforcementMode(settings.tokenEnforcementMode) ? 
          settings.tokenEnforcementMode as TokenEnforcementMode : 
          'never' as TokenEnforcementMode;
        
        chatStore.setTokenEnforcementMode(enforcementMode);
      }
      
      if (settings.features && typeof settings.features === 'object') {
        Object.entries(settings.features).forEach(([key, value]) => {
          if (typeof value === 'boolean' && key in chatStore.features) {
            chatStore.setFeatureState(key as any, value as boolean);
          }
        });
      }
      
      logger.info('Updated chat settings through ChatBridge', { settings });
      return true;
    } catch (error) {
      logger.error('Failed to update chat settings through ChatBridge', { error });
      toast.error('Failed to update chat settings');
      return false;
    }
  }
  
  /**
   * Sets the current chat mode
   */
  static setMode(mode: string) {
    const chatStore = useChatStore.getState();
    
    try {
      // Map UI mode to database mode if needed
      const dbMode = mode in uiModeToDatabaseMode ? 
        uiModeToDatabaseMode[mode] : 
        mode;
        
      chatStore.setSelectedMode(dbMode);
      
      logger.info('Set chat mode through ChatBridge', { mode, dbMode });
      return true;
    } catch (error) {
      logger.error('Failed to set chat mode through ChatBridge', { error, mode });
      toast.error('Failed to set chat mode');
      return false;
    }
  }
  
  /**
   * Sets the current model
   */
  static setModel(model: string) {
    const chatStore = useChatStore.getState();
    
    try {
      chatStore.setSelectedModel(model);
      
      logger.info('Set chat model through ChatBridge', { model });
      return true;
    } catch (error) {
      logger.error('Failed to set chat model through ChatBridge', { error, model });
      toast.error('Failed to set chat model');
      return false;
    }
  }
  
  /**
   * Sets the chat position
   */
  static setPosition(position: ChatPosition) {
    const chatStore = useChatStore.getState();
    
    try {
      chatStore.setPosition(position);
      
      logger.info('Set chat position through ChatBridge', { position });
      return true;
    } catch (error) {
      logger.error('Failed to set chat position through ChatBridge', { error, position });
      toast.error('Failed to set chat position');
      return false;
    }
  }
  
  /**
   * Toggles a chat feature on/off
   */
  static toggleFeature(featureKey: string, value?: boolean) {
    const chatStore = useChatStore.getState();
    
    try {
      if (typeof value === 'boolean') {
        chatStore.setFeatureState(featureKey as any, value);
      } else {
        chatStore.toggleFeature(featureKey as any);
      }
      
      logger.info('Toggled feature through ChatBridge', { featureKey, value });
      return true;
    } catch (error) {
      logger.error('Failed to toggle feature through ChatBridge', { error, featureKey });
      toast.error('Failed to toggle feature');
      return false;
    }
  }
  
  /**
   * Fetches current chat state
   */
  static getChatState() {
    const chatStore = useChatStore.getState();
    const conversationStore = useConversationStore.getState();
    
    // Map the database mode to UI mode for consistency in the UI
    const currentMode = chatStore.currentMode;
    const uiMode = currentMode in databaseModeToUiMode ? 
      databaseModeToUiMode[currentMode as ChatMode] : 
      currentMode;
    
    return {
      isOpen: chatStore.isOpen,
      isMinimized: chatStore.isMinimized,
      position: chatStore.position,
      currentMode: uiMode,
      currentProvider: chatStore.currentProvider,
      features: chatStore.features,
      tokenControl: chatStore.tokenControl,
      currentConversationId: conversationStore.currentConversationId,
      docked: chatStore.docked
    };
  }
  
  /**
   * Handle token operations
   */
  static async updateTokens(amount: number, operation: 'add' | 'spend' | 'set'): Promise<boolean> {
    const chatStore = useChatStore.getState();
    
    try {
      switch (operation) {
        case 'add':
          return await chatStore.addTokens(amount);
        case 'spend':
          return await chatStore.spendTokens(amount);
        case 'set':
          return await chatStore.setTokenBalance(amount);
        default:
          throw new Error(`Unknown token operation: ${operation}`);
      }
    } catch (error) {
      logger.error('Failed to update tokens through ChatBridge', { error, amount, operation });
      toast.error('Failed to update tokens');
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
    updateChatSettings: ChatBridge.updateChatSettings,
    toggleFeature: ChatBridge.toggleFeature,
    getChatState: ChatBridge.getChatState,
    updateTokens: ChatBridge.updateTokens,
    setMode: ChatBridge.setMode,
    setModel: ChatBridge.setModel,
    setPosition: ChatBridge.setPosition
  };
};
