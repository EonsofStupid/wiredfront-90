
import { useChatSessionStore } from '@/components/chat/store/chat-sessions/store';
import { useMessageStore } from '@/components/chat/store/message';
import { useChatStore } from '@/components/chat/store/chatStore';
import { 
  CreateSessionParams, 
  UpdateSessionParams
} from '@/types/sessions';
import { 
  Message, 
  MessageMetadata,
  MessageRequest,
  MessageResponse 
} from '@/components/chat/shared/schemas/messages';
import { logger } from './LoggingService';
import { supabase } from '@/integrations/supabase/client';

/**
 * ChatBridge serves as the central communication hub between the chat client
 * and the rest of the application. It coordinates session management, message
 * handling, and integration with external services.
 */

// Static bridge for non-component access
export const ChatBridge = {
  // Session operations
  createSession: async (params: CreateSessionParams = {}): Promise<string> => {
    try {
      const sessionId = await useChatSessionStore.getState().createSession(params);
      return sessionId;
    } catch (error) {
      logger.error('ChatBridge: Failed to create session', { error });
      throw error;
    }
  },
  
  switchSession: async (sessionId: string): Promise<void> => {
    try {
      await useChatSessionStore.getState().switchSession(sessionId);
      
      // Load messages for this session
      await useMessageStore.getState().fetchSessionMessages(sessionId);
    } catch (error) {
      logger.error('ChatBridge: Failed to switch session', { error });
      throw error;
    }
  },
  
  updateSession: async (sessionId: string, params: UpdateSessionParams): Promise<void> => {
    try {
      await useChatSessionStore.getState().updateSession(sessionId, params);
    } catch (error) {
      logger.error('ChatBridge: Failed to update session', { error });
      throw error;
    }
  },
  
  archiveSession: async (sessionId: string): Promise<void> => {
    try {
      await useChatSessionStore.getState().archiveSession(sessionId);
    } catch (error) {
      logger.error('ChatBridge: Failed to archive session', { error });
      throw error;
    }
  },
  
  // Message operations
  sendMessage: async (request: MessageRequest): Promise<MessageResponse> => {
    try {
      const { content, sessionId, mode, metadata = {} } = request;
      
      // Get current sessionId if not provided
      const currentSessionId = sessionId || useChatSessionStore.getState().currentSessionId;
      
      // If no session exists, create one
      if (!currentSessionId) {
        const newSessionId = await ChatBridge.createSession({ 
          metadata: { mode } 
        });
        
        // Create and add user message
        const message = useMessageStore.getState().createUserMessage(
          content, 
          newSessionId,
          metadata
        );
        
        // Process with AI API
        await processWithAI(message);
        
        return { success: true, message };
      }
      
      // Use existing session
      const message = useMessageStore.getState().createUserMessage(
        content, 
        currentSessionId,
        metadata
      );
      
      // Process with AI API
      await processWithAI(message);
      
      return { success: true, message };
    } catch (error) {
      logger.error('ChatBridge: Failed to send message', { error });
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },
  
  // UI operations
  toggleChat: () => {
    const chatStore = useChatStore.getState();
    if (chatStore.toggleChat) {
      chatStore.toggleChat();
    }
  },
  
  openChat: () => {
    const chatStore = useChatStore.getState();
    // Use toggleUIState action for opening the chat
    if (chatStore.isOpen === false && chatStore.toggleUIState) {
      chatStore.toggleUIState('isOpen', true);
    }
  },
  
  closeChat: () => {
    const chatStore = useChatStore.getState();
    // Use toggleUIState action for closing the chat
    if (chatStore.isOpen === true && chatStore.toggleUIState) {
      chatStore.toggleUIState('isOpen', false);
    }
  }
};

// Helper function to process a message with AI
async function processWithAI(message: Message) {
  try {
    // Update message status to pending
    useMessageStore.getState().updateMessage(message.id, {
      message_status: 'pending'
    });
    
    // Call AI API
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        message: message.content, 
        sessionId: message.chat_session_id,
        metadata: message.metadata
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Create assistant message with response
    useMessageStore.getState().createAssistantMessage(
      data.response || 'No response received',
      message.chat_session_id,
      data.metadata || {}
    );
    
    // Update original message status to sent
    useMessageStore.getState().updateMessage(message.id, {
      message_status: 'sent'
    });
  } catch (error) {
    logger.error('Failed to process message with AI', { error, messageId: message.id });
    
    // Update message status to error
    useMessageStore.getState().updateMessage(message.id, {
      message_status: 'error'
    });
    
    // Create error message
    useMessageStore.getState().createErrorMessage(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
      message.chat_session_id
    );
  }
}

// React hook for component access
export const useChatBridge = () => {
  // Sessions
  const {
    createSession,
    switchSession,
    updateSession,
    archiveSession,
    currentSessionId,
    sessions
  } = useChatSessionStore();
  
  // Messages
  const {
    messages,
    createUserMessage,
    createAssistantMessage,
    createSystemMessage,
    createErrorMessage
  } = useMessageStore();
  
  // Chat UI
  const chatStore = useChatStore();
  
  return {
    // Sessions
    createSession,
    switchSession,
    updateSession,
    archiveSession,
    currentSessionId,
    sessions,
    
    // Messages
    messages,
    sendMessage: (content: string, metadata?: MessageMetadata) => {
      if (!currentSessionId) {
        throw new Error('No active session');
      }
      
      return ChatBridge.sendMessage({ 
        content, 
        sessionId: currentSessionId,
        metadata
      });
    },
    
    // UI
    toggleChat: chatStore.toggleChat,
    isOpen: chatStore.isOpen
  };
};
