import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useProviderRegistry } from '@/services/providers/providerRegistryStore';
import { useMessageQueue } from '@/services/messages/messageQueueStore';
import { useMessageStorage } from '@/services/messages/messageStorageStore';
import { useSessionManager } from '@/services/sessions/sessionManagerStore';
import { ChatMode, ProviderCategoryType, ProviderCategory } from '@/components/chat/store/types/chat-store-types';
import { Message, MessageRole } from '@/types/chat';
import { persistenceManager } from '@/services/persistence/persistenceManager';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { Provider } from '@/services/providers/types';

export interface UseChatCoreOptions {
  autoInit?: boolean;
  defaultMode?: ChatMode;
  persistPosition?: boolean;
  enableAnalytics?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  autoScroll?: boolean;
}

/**
 * Adapts a Provider to ProviderCategory format
 */
function adaptProviderToCategory(provider: Provider): ProviderCategory {
  return {
    id: provider.id,
    name: provider.name,
    models: Object.keys(provider.modeConfigs).map(mode => provider.modeConfigs[mode].modelName),
    type: provider.type,
    enabled: provider.isEnabled,
    icon: undefined, // Provider doesn't have this field
    description: undefined, // Provider doesn't have this field
    supportsStreaming: provider.capabilities.streaming,
    costPerToken: undefined, // Provider doesn't have this field
    category: provider.category,
    isDefault: provider.isDefault,
    isEnabled: provider.isEnabled
  };
}

export function useChatCore(options: UseChatCoreOptions = {}) {
  const {
    autoInit = true,
    defaultMode = 'chat' as ChatMode,
    persistPosition = true,
    enableAnalytics = true,
    onError,
    onSuccess,
    autoScroll = true
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Access the various stores
  const { 
    messages,
    currentMode, 
    setCurrentMode, 
    currentProvider,
    updateCurrentProvider,
    position,
    togglePosition,
    docked,
    toggleDocked,
    isOpen,
    isMinimized,
    addMessage,
    updateMessage,
    setUserInput,
    userInput,
    isWaitingForResponse
  } = useChatStore();
  
  const { 
    providers, 
    getProvidersByCategory, 
    getDefaultProvider, 
    setCurrentProvider: selectProvider,
    testConnection,
    isInitialized: providersInitialized
  } = useProviderRegistry();
  
  const {
    enqueueMessage,
    isProcessing
  } = useMessageQueue();
  
  const {
    getMessages,
    updateMessage: storageUpdateMessage
  } = useMessageStorage();
  
  const {
    currentSession,
    createSession,
    setCurrentSession,
    fetchSessions
  } = useSessionManager();
  
  // Error handling
  const { 
    error, 
    handleError, 
    wrapPromise 
  } = useErrorHandler({
    context: 'chat-core',
    showToast: true
  });

  // Initialize all systems
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      logger.info('Initializing chat core systems');
      
      // 1. Load the session
      await wrapPromise(fetchSessions());
      const session = currentSession || await createSession();

      // 2. Load chat state
      if (persistPosition) {
        const savedPosition = persistenceManager.getItem<string>('chat_position');
        if (savedPosition) {
          const [x, y] = savedPosition.split(',').map(Number);
          if (!isNaN(x) && !isNaN(y)) {
            useChatStore.getState().setPosition({ x, y });
          }
        }
      }
      
      // 3. Set default mode if not already set
      if (!currentMode) {
        setCurrentMode(defaultMode);
      }
      
      // 4. Set default provider if needed
      if (!currentProvider) {
        const category = currentMode === 'image' ? 'image' : 'chat';
        const defaultProvider = getDefaultProvider(category as ProviderCategoryType);
        
        if (defaultProvider) {
          updateCurrentProvider(adaptProviderToCategory(defaultProvider));
        }
      }
      
      setIsInitialized(true);
      logger.info('Chat core systems initialized');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      handleError(error, 'Failed to initialize chat core systems');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    currentSession, 
    createSession, 
    persistPosition, 
    currentMode, 
    defaultMode, 
    setCurrentMode, 
    currentProvider, 
    getDefaultProvider, 
    updateCurrentProvider, 
    wrapPromise, 
    handleError,
    onSuccess,
    fetchSessions
  ]);

  // Auto-initialize when component mounts
  useEffect(() => {
    if (autoInit && !isInitialized) {
      initialize();
    }
  }, [autoInit, isInitialized, initialize]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession?.id) {
      try {
        const sessionMessages = getMessages(currentSession.id);
        
        if (sessionMessages.length === 0) {
          // If there are no messages, add a system welcome message
          const welcomeMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: 'How can I assist you today?',
            timestamp: new Date().toISOString(),
            chat_session_id: currentSession.id
          };
          
          addMessage(welcomeMessage);
        }
      } catch (error) {
        handleError(error, 'Error loading session messages');
      }
    }
  }, [currentSession?.id, getMessages, addMessage, handleError]);

  // Helper function to send a message
  const sendMessage = useCallback(async (content: string, role: MessageRole = 'user') => {
    try {
      if (!content.trim()) {
        return;
      }
      
      if (!currentSession?.id) {
        throw new Error('No active session');
      }
      
      // Create and add the message
      const messageId = uuidv4();
      const message: Message = {
        id: messageId,
        role,
        content,
        timestamp: new Date().toISOString(),
        chat_session_id: currentSession.id,
        message_status: 'pending'
      };
      
      // Add to storage
      addMessage(message);
      
      // Enqueue for processing (with high priority for user messages)
      const priority = role === 'user' ? 'high' : 'normal';
      enqueueMessage(message, { priority });
      
      return messageId;
    } catch (error) {
      handleError(error, 'Error sending message');
      return null;
    }
  }, [currentSession?.id, addMessage, enqueueMessage, handleError]);

  // Helper to switch modes
  const switchMode = useCallback(async (mode: ChatMode) => {
    try {
      // Set the new mode
      setCurrentMode(mode);
      
      // Get appropriate provider for this mode
      const category = mode === 'image' ? 'image' : 'chat';
      const defaultProvider = getDefaultProvider(category as ProviderCategoryType);
      
      if (defaultProvider) {
        updateCurrentProvider(adaptProviderToCategory(defaultProvider));
      }
      
      return true;
    } catch (error) {
      handleError(error, 'Error switching mode');
      return false;
    }
  }, [setCurrentMode, getDefaultProvider, updateCurrentProvider, handleError]);
  
  return {
    // State
    isInitialized,
    isLoading,
    error,
    
    // Chat state
    messages,
    currentMode,
    currentProvider,
    position,
    docked,
    isOpen,
    isMinimized,
    userInput,
    isWaitingForResponse,
    
    // Actions
    sendMessage,
    switchMode,
    setUserInput,
    toggleDocked,
    togglePosition,
    updateMessage,
    getMessages,
    storageUpdateMessage,
    testConnection,
    selectProvider,
    getProvidersByCategory
  };
}
