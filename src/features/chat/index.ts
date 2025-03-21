// Export DraggableChat and related components
export * from './components/DraggableChat';

// Export individual components
export { default as ChatContent } from './components/ChatContent';
export { default as ChatHeader } from './components/ChatHeader';
export { default as ChatInputArea } from './components/ChatInputArea';
export { default as ChatMessage } from './components/ChatMessage';
export { default as ChatContainer } from './components/DraggableChat/ChatContainer';
export { default as ChatSidebar } from './components/DraggableChat/ChatSidebar';
export { ChatToggleButton } from './components/DraggableChat/ChatToggleButton';
export { IconStack } from './components/IconStack';

// Export hooks
export * from './hooks/useChat';
export * from './hooks/useViewportAwareness';

// Export styles
import './styles/chat.css';

// Export types directly from types folder
export * from '@/types/chat/types';

// Export services
export * from './services/LoggingService';

// Export store factories
export * from '@/features/chat/store/chatLayoutStore';
export * from '@/features/chat/store/messageStore';
export * from '@/features/chat/store/modeStore';
export * from '@/features/chat/store/sessionStore';
