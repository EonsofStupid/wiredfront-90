
// Re-export the chat session manager hook
export { useChatSessionManager } from '@/components/chat/hooks/chat-sessions';

// For backward compatibility
export const useSessionManager = useChatSessionManager;
