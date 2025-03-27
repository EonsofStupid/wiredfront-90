// Re-export the chat session manager hook
export { useChatSessionManager } from './chat-sessions/useChatSessionManager';

// For backward compatibility
export const useSessionManager = useChatSessionManager;
