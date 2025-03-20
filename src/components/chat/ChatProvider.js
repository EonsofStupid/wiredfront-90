import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from './messaging/MessageManager';
import { Spinner } from './components/Spinner';
import './styles/index.css'; // Import all chat styles
const ChatContext = createContext(undefined);
export const ChatProvider = ({ children }) => {
    const location = useLocation();
    const isEditorPage = location.pathname === '/editor';
    const { isOpen, initializeChatSettings, setSessionLoading } = useChatStore();
    const { currentSessionId, refreshSessions } = useSessionManager();
    const messageStore = useMessageStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    // Initialize CSS custom properties
    useEffect(() => {
        const initializeStyles = () => {
            // Ensure CSS variables are set with defaults if they aren't already
            const cssVars = {
                '--chat-bg': 'rgba(0, 0, 0, 0.3)',
                '--chat-message-user-bg': '#8B5CF6',
                '--chat-message-assistant-bg': '#374151',
                '--chat-width': '400px',
                '--chat-height': '500px'
            };
            Object.entries(cssVars).forEach(([property, defaultValue]) => {
                const currentValue = getComputedStyle(document.documentElement).getPropertyValue(property);
                if (!currentValue || currentValue === '') {
                    document.documentElement.style.setProperty(property, defaultValue);
                }
            });
        };
        initializeStyles();
    }, []);
    useEffect(() => {
        const initialize = async () => {
            try {
                setIsInitializing(true);
                initializeChatSettings();
                logger.info('Chat settings initialized');
                if (isEditorPage || location.pathname === '/') {
                    setSessionLoading(true);
                    await refreshSessions();
                    setSessionLoading(false);
                }
                setIsInitialized(true);
            }
            catch (error) {
                logger.error('Failed to initialize chat', { error });
                console.error('Failed to initialize chat:', error);
            }
            finally {
                setIsInitializing(false);
            }
        };
        initialize();
    }, [initializeChatSettings, isEditorPage, location.pathname, refreshSessions, setSessionLoading]);
    useEffect(() => {
        logger.info('Chat context updated', {
            isEditorPage,
            isOpen,
            currentSessionId,
            isInitialized
        });
    }, [isEditorPage, isOpen, currentSessionId, isInitialized]);
    if (isInitializing) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Initializing chat system..." })] }) }));
    }
    return (_jsx(ChatContext.Provider, { value: { isEditorPage, isInitialized, isInitializing }, children: _jsxs(ChatModeProvider, { isEditorPage: isEditorPage, children: [children, _jsx(Toaster, { position: "top-right" })] }) }));
};
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
