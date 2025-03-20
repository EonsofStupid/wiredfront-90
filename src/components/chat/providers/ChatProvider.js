import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { Toaster } from "sonner";
import { useLocation } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { useSessionManager } from '@/hooks/sessions/useSessionManager';
import { logger } from '@/services/chat/LoggingService';
import { Spinner } from '../components/ui/Spinner';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ChatModeProvider } from './ChatModeProvider';
const ChatContext = createContext(undefined);
export function ChatProvider({ children }) {
    const location = useLocation();
    const isEditorPage = location.pathname === '/editor';
    const { isOpen, initializeChatSettings, setSessionLoading } = useChatStore();
    const { currentSessionId, refreshSessions } = useSessionManager();
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState(null);
    // Initialize the chat system
    useEffect(() => {
        const initialize = async () => {
            try {
                setIsInitializing(true);
                // Initialize chat settings from the store
                initializeChatSettings();
                logger.info('Chat settings initialized');
                // If on editor or home page, load sessions
                if (isEditorPage || location.pathname === '/') {
                    setSessionLoading(true);
                    await refreshSessions();
                    setSessionLoading(false);
                }
                setIsInitialized(true);
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error('Failed to initialize chat');
                setError(err);
                logger.error('Failed to initialize chat', { error });
            }
            finally {
                setIsInitializing(false);
            }
        };
        initialize();
    }, [initializeChatSettings, isEditorPage, location.pathname, refreshSessions, setSessionLoading]);
    // Log important state changes
    useEffect(() => {
        logger.info('Chat context updated', {
            isEditorPage,
            isOpen,
            currentSessionId,
            isInitialized
        });
    }, [isEditorPage, isOpen, currentSessionId, isInitialized]);
    // Show loading state while initializing
    if (isInitializing) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: _jsxs("div", { className: "text-center", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Initializing chat system..." })] }) }));
    }
    // Show error state if initialization failed
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-destructive mb-2", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("p", { className: "text-destructive", children: "Failed to initialize chat" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: error.message }), _jsx("button", { className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm", onClick: () => window.location.reload(), children: "Retry" })] }) }));
    }
    return (_jsx(ErrorBoundary, { children: _jsx(ChatContext.Provider, { value: { isEditorPage, isInitialized, isInitializing }, children: _jsxs(ChatModeProvider, { isEditorPage: isEditorPage, children: [children, _jsx(Toaster, { position: "top-right" })] }) }) }));
}
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
