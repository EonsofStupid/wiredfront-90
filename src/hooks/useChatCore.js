import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useProviderRegistry } from '@/services/providers/providerRegistryStore';
import { useMessageQueue } from '@/services/messages/messageQueueStore';
import { useMessageStorage } from '@/services/messages/messageStorageStore';
import { useSessionManager } from '@/services/sessions/sessionManagerStore';
import { persistenceManager } from '@/services/persistence/persistenceManager';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/services/chat/LoggingService';
import { chatSessionsService } from '@/services/chat/chatSessionsService';
import { chatMessagesService } from '@/services/chat/chatMessagesService';
import { supabase } from '@/integrations/supabase/client';
/**
 * Adapts a Provider to ProviderCategory format
 */
function adaptProviderToCategory(provider) {
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
export function useChatCore(options = {}) {
    const { autoInit = true, defaultMode = 'chat', persistPosition = true, enableAnalytics = true, onError, onSuccess, autoScroll = true } = options;
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [currentDBSession, setCurrentDBSession] = useState(null);
    // Access the various stores
    const { messages, currentMode, setCurrentMode, currentProvider, updateCurrentProvider, position, togglePosition, docked, toggleDocked, isOpen, isMinimized, addMessage, updateMessage, setUserInput, userInput, isWaitingForResponse } = useChatStore();
    const { providers, getProvidersByCategory, getDefaultProvider, setCurrentProvider: selectProvider, testConnection, isInitialized: providersInitialized } = useProviderRegistry();
    const { enqueueMessage, isProcessing } = useMessageQueue();
    const { getMessages, updateMessage: storageUpdateMessage } = useMessageStorage();
    const { currentSession, createSession: createLegacySession, setCurrentSession, fetchSessions } = useSessionManager();
    // Error handling
    const { error, handleError, wrapPromise } = useErrorHandler({
        context: 'chat-core',
        showToast: true
    });
    // Load chat sessions
    const loadSessions = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedSessions = await chatSessionsService.fetchSessions();
            setSessions(fetchedSessions);
            // Set the most recent session as current if available
            if (fetchedSessions.length > 0 && !currentDBSession) {
                setCurrentDBSession(fetchedSessions[0]);
            }
            return fetchedSessions;
        }
        catch (err) {
            handleError(err, 'Failed to load chat sessions');
            return [];
        }
        finally {
            setIsLoading(false);
        }
    }, [currentDBSession, handleError]);
    // Create a new session
    const createSession = useCallback(async (title, mode = defaultMode) => {
        try {
            const newSession = await chatSessionsService.createSession({
                title: title || `Chat ${new Date().toLocaleString()}`,
                mode
            });
            setSessions(prev => [newSession, ...prev]);
            setCurrentDBSession(newSession);
            return newSession;
        }
        catch (err) {
            handleError(err, 'Failed to create new chat session');
            throw err;
        }
    }, [defaultMode, handleError]);
    // Initialize all systems
    const initialize = useCallback(async () => {
        try {
            setIsLoading(true);
            logger.info('Initializing chat core systems');
            // 1. Load the sessions
            const fetchedSessions = await loadSessions();
            // 2. Create session if none exists
            if (fetchedSessions.length === 0) {
                await createSession();
            }
            // 3. Load chat state
            if (persistPosition) {
                const savedPosition = persistenceManager.getItem('chat_position');
                if (savedPosition) {
                    const [x, y] = savedPosition.split(',').map(Number);
                    if (!isNaN(x) && !isNaN(y)) {
                        useChatStore.getState().setPosition({ x, y });
                    }
                }
            }
            // 4. Set default mode if not already set
            if (!currentMode) {
                setCurrentMode(defaultMode);
            }
            // 5. Set default provider if needed
            if (!currentProvider) {
                const category = currentMode === 'image' ? 'image' : 'chat';
                const defaultProvider = getDefaultProvider(category);
                if (defaultProvider) {
                    updateCurrentProvider(adaptProviderToCategory(defaultProvider));
                }
            }
            setIsInitialized(true);
            logger.info('Chat core systems initialized');
            if (onSuccess) {
                onSuccess();
            }
        }
        catch (error) {
            handleError(error, 'Failed to initialize chat core systems');
            if (onError) {
                onError(error);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [
        loadSessions,
        createSession,
        persistPosition,
        currentMode,
        defaultMode,
        setCurrentMode,
        currentProvider,
        getDefaultProvider,
        updateCurrentProvider,
        handleError,
        onSuccess,
        onError
    ]);
    // Auto-initialize when component mounts
    useEffect(() => {
        if (autoInit && !isInitialized) {
            initialize();
        }
    }, [autoInit, isInitialized, initialize]);
    // Load messages when session changes
    useEffect(() => {
        const loadMessages = async () => {
            if (currentDBSession?.id) {
                try {
                    const { messages: fetchedMessages } = await chatMessagesService.fetchMessages(currentDBSession.id);
                    // Clear existing messages and add new ones
                    useChatStore.getState().resetChatState();
                    fetchedMessages.forEach(msg => {
                        addMessage({
                            id: msg.id,
                            role: msg.role,
                            content: msg.content,
                            timestamp: msg.created_at || new Date().toISOString(),
                            chat_session_id: msg.session_id
                        });
                    });
                    if (fetchedMessages.length === 0) {
                        // If there are no messages, add a system welcome message
                        const welcomeMessage = {
                            id: uuidv4(),
                            role: 'assistant',
                            content: 'How can I assist you today?',
                            timestamp: new Date().toISOString(),
                            chat_session_id: currentDBSession.id
                        };
                        addMessage(welcomeMessage);
                    }
                }
                catch (error) {
                    handleError(error, 'Error loading session messages');
                }
            }
        };
        loadMessages();
    }, [currentDBSession?.id, addMessage, handleError]);
    // Helper function to send a message
    const sendMessage = useCallback(async (content, role = 'user') => {
        try {
            if (!content.trim()) {
                return;
            }
            if (!currentDBSession?.id) {
                throw new Error('No active session');
            }
            // Create and add the message
            const messageId = uuidv4();
            // Create a message for storage and UI
            const uiMessage = {
                id: messageId,
                role,
                content,
                timestamp: new Date().toISOString(),
                chat_session_id: currentDBSession.id,
                message_status: 'pending'
            };
            // Create message for database
            const dbMessage = {
                session_id: currentDBSession.id,
                user_id: (await supabase.auth.getUser()).data.user?.id || '',
                role,
                content,
                status: 'pending',
                metadata: {}
            };
            // Add to UI
            addMessage(uiMessage);
            // Send to database
            const sentMessage = await chatMessagesService.sendMessage(dbMessage);
            // Update UI message with database ID
            updateMessage(messageId, {
                id: sentMessage.id,
                message_status: 'sent'
            });
            return sentMessage.id;
        }
        catch (error) {
            handleError(error, 'Error sending message');
            return null;
        }
    }, [currentDBSession?.id, addMessage, updateMessage, handleError]);
    // Helper to switch sessions
    const switchSession = useCallback(async (sessionId) => {
        try {
            const session = sessions.find(s => s.id === sessionId);
            if (!session) {
                throw new Error('Session not found');
            }
            setCurrentDBSession(session);
            // Update last accessed timestamp
            await chatSessionsService.updateSession(sessionId, {
                updated_at: new Date().toISOString()
            });
            return true;
        }
        catch (error) {
            handleError(error, 'Error switching session');
            return false;
        }
    }, [sessions, handleError]);
    // Helper to switch modes
    const switchMode = useCallback(async (mode) => {
        try {
            // Set the new mode
            setCurrentMode(mode);
            // Update session mode if we have a current session
            if (currentDBSession?.id) {
                await chatSessionsService.updateSession(currentDBSession.id, { mode });
            }
            // Get appropriate provider for this mode
            const category = mode === 'image' ? 'image' : 'chat';
            const defaultProvider = getDefaultProvider(category);
            if (defaultProvider) {
                updateCurrentProvider(adaptProviderToCategory(defaultProvider));
            }
            return true;
        }
        catch (error) {
            handleError(error, 'Error switching mode');
            return false;
        }
    }, [setCurrentMode, getDefaultProvider, updateCurrentProvider, handleError, currentDBSession]);
    return {
        // State
        isInitialized,
        isLoading,
        error,
        sessions,
        currentDBSession,
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
        // Session actions
        loadSessions,
        createSession,
        switchSession,
        // Message actions
        sendMessage,
        // Mode actions
        switchMode,
        // UI actions
        setUserInput,
        toggleDocked,
        togglePosition,
        updateMessage,
        // Provider actions
        testConnection,
        selectProvider,
        getProvidersByCategory
    };
}
