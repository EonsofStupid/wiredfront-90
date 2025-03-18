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

interface UseChatCoreOptions {
  autoInit?: boolean;
  defaultMode?: ChatMode;
  persistPosition?: boolean;
  enableAnalytics?: boolean;
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
    defaultMode = 'chat',
    persistPosition = true,
    enableAnalytics = true
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
    isMinimized
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
    addMessage,
    getMessages,
    updateMessage
  } = useMessageStorage();
  
  const {
    currentSessionId,
    createSession,
    switchSession,
    getCurrentSession
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
      await wrapPromise(useSessionManager.getState().fetchSessions());
      const sessionId = currentSessionId || await createSession();

      // 2. Load chat state
      if (persistPosition) {
        const savedPosition = persistenceManager.getItem<string>('chat_position');
        if (savedPosition && (savedPosition === 'bottom-right' || savedPosition === 'bottom-left')) {
          useChatStore.getState().setPosition(savedPosition);
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
    } catch (error) {
      handleError(error, 'Failed to initialize chat core systems');
    } finally {
      setIsLoading(false);
    }
  }, [
    currentSessionId, 
    createSession, 
    persistPosition, 
    currentMode, 
    defaultMode, 
    setCurrentMode, 
    currentProvider, 
    getDefaultProvider, 
    updateCurrentProvider, 
    wrapPromise, 
    handleError
  ]);

  // Auto-initialize when component mounts
  useEffect(() => {
    if (autoInit && !isInitialized) {
      initialize();
    }
  }, [autoInit, isInitialized, initialize]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      try {
        const sessionMessages = getMessages(currentSessionId);
        
        if (sessionMessages.length === 0) {
          // If there are no messages, add a system welcome message
          const welcomeMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: 'How can I assist you today?',
            timestamp: new Date().toISOString(),
            chat_session_id: currentSessionId
          };
          
          addMessage(welcomeMessage);
        }
      } catch (error) {
        handleError(error, 'Error loading session messages');
      }
    }
  }, [currentSessionId, getMessages, addMessage, handleError]);

  // Helper function to send a message
  const sendMessage = useCallback(async (content: string, role: MessageRole = 'user') => {
    try {
      if (!content.trim()) {
        return;
      }
      
      if (!currentSessionId) {
        throw new Error('No active session');
      }
      
      // Create and add the message
      const messageId = uuidv4();
      const message: Message = {
        id: messageId,
        role,
        content,
        timestamp: new Date().toISOString(),
        chat_session_id: currentSessionId,
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
  }, [currentSessionId, addMessage, enqueueMessage, handleError]);

  // Helper to switch modes
  const switchMode = useCallback(async (mode: ChatMode) => {
    try {
      // Set the new mode
      setCurrentMode(mode);
      
      // Get appropriate provider for this mode
      const category = mode === 'image' ? 'image' : 'chat';
      const modeProviders = getProvidersByCategory(category as ProviderCategoryType);
      
      // If we don't have a suitable provider for this mode, or current provider is wrong category
      if (
        !currentProvider || 
        currentProvider.category !== category || 
        !modeProviders.some(p => p.id === currentProvider.id)
      ) {
        const defaultProvider = getDefaultProvider(category as ProviderCategoryType);
        if (defaultProvider) {
          updateCurrentProvider(adaptProviderToCategory(defaultProvider));
          await testConnection(defaultProvider.id);
        } else if (modeProviders.length > 0) {
          updateCurrentProvider(adaptProviderToCategory(modeProviders[0]));
          await testConnection(modeProviders[0].id);
        } else {
          toast.warning(`No providers available for ${mode} mode`);
        }
      }
      
      const currentSession = getCurrentSession();
      if (currentSession) {
        // Update session metadata with the new mode
        await useSessionManager.getState().updateSession(currentSession.id, {
          metadata: {
            ...(currentSession.metadata || {}),
            mode
          }
        });
      }
      
      // Add system message about mode switch
      await sendMessage(`Mode switched to ${mode}`, 'system');
      
      // Log analytics if enabled
      if (enableAnalytics) {
        logger.info(`Mode switched to ${mode}`, { 
          previousMode: currentMode,
          newMode: mode,
          sessionId: currentSessionId
        });
      }
      
      return true;
    } catch (error) {
      handleError(error, `Error switching to ${mode} mode`);
      return false;
    }
  }, [
    setCurrentMode,
    currentProvider,
    getProvidersByCategory,
    getDefaultProvider,
    updateCurrentProvider,
    testConnection,
    getCurrentSession,
    currentMode,
    currentSessionId,
    sendMessage,
    enableAnalytics,
    handleError
  ]);

  return {
    // State
    isInitialized,
    isLoading,
    error,
    currentMode,
    currentProvider,
    currentSessionId,
    position,
    docked,
    isOpen,
    isMinimized,
    isProcessing,
    messages,
    
    // Actions
    initialize,
    sendMessage,
    switchMode,
    selectProvider,
    togglePosition,
    toggleDocked,
    
    // Session actions
    createSession,
    switchSession,
    getCurrentSession,
    
    // Message actions
    updateMessage,
    
    // Provider helpers
    getProvidersByCategory,
    providers,
    providersInitialized
  };
}
