
import { useCallback } from 'react';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatMode } from '@/types/chat/types';

export const useChat = () => {
  // Access all chat-related stores
  const layout = useChatLayoutStore();
  const mode = useChatModeStore();
  const messageStore = useChatMessageStore();
  const sessionStore = useChatSessionStore();

  // Combine commonly used values
  const isWaitingForResponse = messageStore.isLoading;
  
  // Create a new chat session
  const createSession = useCallback(async (options?: { 
    mode?: ChatMode, 
    title?: string 
  }) => {
    try {
      const session = await sessionStore.createSession({
        mode: options?.mode || mode.currentMode,
        title: options?.title || `New ${options?.mode || mode.currentMode} chat`
      });
      
      // Set as current session
      sessionStore.setCurrentSession(session);
      
      // Switch to the session's mode if needed
      if (session.mode !== mode.currentMode) {
        mode.setMode(session.mode as ChatMode);
      }
      
      return session;
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create new chat session');
      return null;
    }
  }, [sessionStore, mode]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    try {
      // Ensure we have an active session
      if (!sessionStore.currentSession) {
        const newSession = await createSession();
        if (!newSession) throw new Error('Could not create a new session');
      }
      
      const sessionId = sessionStore.currentSession?.id;
      if (!sessionId) throw new Error('No active session found');
      
      // Send the message
      const messageId = await messageStore.sendMessage(content, sessionId);
      
      // Simulate AI response for now
      const aiMessageId = uuidv4();
      messageStore.addMessage({
        id: aiMessageId,
        session_id: sessionId,
        role: 'assistant',
        content: `This is a placeholder response for "${content}". Real AI integration pending.`,
        message_status: 'sent',
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString()
      });
      
      return messageId;
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      return null;
    }
  }, [messageStore, sessionStore, createSession]);
  
  // Get welcome message based on mode
  const getWelcomeMessage = useCallback(() => {
    switch (mode.currentMode) {
      case 'dev': return 'I can help you with your code. Ask me anything about development!';
      case 'image': return 'Describe the image you want to generate, and I\'ll create it for you.';
      case 'training': return 'I\'m here to help you learn. What would you like to practice today?';
      case 'planning': return 'Let\'s plan your project together. What are you working on?';
      case 'code': return 'I can help you write, review, or debug code. What are you working on?';
      default: return 'How can I help you today?';
    }
  }, [mode.currentMode]);
  
  return {
    // Layout
    isOpen: layout.isOpen,
    isMinimized: layout.isMinimized,
    showSidebar: layout.showSidebar,
    docked: layout.docked,
    position: layout.position,
    scale: layout.scale,
    toggleOpen: layout.toggleOpen,
    toggleMinimize: layout.toggleMinimize,
    toggleSidebar: layout.toggleSidebar,
    toggleDocked: layout.toggleDocked,
    setPosition: layout.setPosition,
    setScale: layout.setScale,
    
    // Mode
    currentMode: mode.currentMode,
    setMode: mode.setMode,
    switchMode: mode.switchMode,
    
    // Messages
    messages: messageStore.messages,
    isLoading: messageStore.isLoading,
    sendMessage,
    clearMessages: messageStore.clearMessages,
    
    // Sessions
    currentSession: sessionStore.currentSession,
    sessions: sessionStore.sessions,
    createSession,
    
    // Utility
    isWaitingForResponse,
    getWelcomeMessage
  };
};

export default useChat;
