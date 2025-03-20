import { useState, useCallback } from "react";
/**
 * Hook to manage mobile chat state and interactions
 */
export const useMobileChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const openChat = useCallback(() => {
        setIsOpen(true);
        setIsMinimized(false);
    }, []);
    const closeChat = useCallback(() => {
        setIsOpen(false);
    }, []);
    const toggleChat = useCallback(() => {
        if (isOpen) {
            if (isMinimized) {
                setIsMinimized(false);
            }
            else {
                setIsMinimized(true);
            }
        }
        else {
            openChat();
        }
    }, [isOpen, isMinimized, openChat]);
    const toggleMinimize = useCallback(() => {
        setIsMinimized(prev => !prev);
    }, []);
    return {
        isOpen,
        isMinimized,
        openChat,
        closeChat,
        toggleChat,
        toggleMinimize
    };
};
