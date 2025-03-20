import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { isChatMode } from '@/types/chat';
import { validateChatMode } from '@/utils/validation/chatTypes';
const ChatModeContext = createContext(undefined);
export function ChatModeProvider({ children, isEditorPage }) {
    const [currentMode, setCurrentMode] = useState('chat');
    const { setCurrentMode: setStoreMode } = useChatStore();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        // Get mode from location state if available
        const locationMode = location.state?.mode;
        if (locationMode) {
            // Validate and normalize the mode
            const validMode = validateChatMode(locationMode, { silent: true, fallback: 'chat' });
            if (validMode !== currentMode) {
                setCurrentMode(validMode);
                setStoreMode(validMode);
                logger.info('Mode set from location state', { mode: validMode });
            }
        }
    }, [location.state?.mode, setStoreMode, currentMode]);
    const setMode = (mode) => {
        if (isModeSupported(mode)) {
            setCurrentMode(mode);
            setStoreMode(mode);
            // Update the location state
            navigate(location.pathname, {
                state: { ...location.state, mode }
            });
            logger.info('Mode updated', { mode });
        }
        else {
            logger.warn('Unsupported mode', { mode });
        }
    };
    const isModeSupported = (mode) => {
        return isChatMode(mode);
    };
    return (_jsx(ChatModeContext.Provider, { value: {
            currentMode,
            setMode,
            isModeSupported,
            isEditorPage
        }, children: children }));
}
export function useChatMode() {
    const context = useContext(ChatModeContext);
    if (context === undefined) {
        throw new Error('useChatMode must be used within a ChatModeProvider');
    }
    return context;
}
