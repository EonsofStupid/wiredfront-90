
// Consolidated export file for the chat module
// This provides a single entry point for all chat components and functionality

// Core store exports
export * from './store/chatStore';
export * from './store/conversation';
export * from './store/token';

// Chat structure and UI components
export * from './chat-structure';
export * from './shared/ChatPositionToggle';
export * from './shared/Spinner';

// Hook exports
export * from './hooks/conversation';
export * from './hooks/useConversationCleanup';
export * from './hooks/useMode';

// Messaging system
export * from './messaging/MessageManager';

// Chat bridge - main integration point for external apps
export { ChatBridge, ChatBridgeProvider, useChatBridge } from './chatBridge';

// Feature exports
export * from './features/modes/hooks/useMode';

// Type exports
export * from '@/types/chat';
