
// Export DraggableChat and related components
export * from './components/DraggableChat';

// Export individual components
export { default as ChatContent } from './components/ChatContent';
export { default as ChatMessage } from './components/ChatMessage';
export { default as ChatInputArea } from './components/ChatInputArea';
export { IconStack } from './components/IconStack';

// Export hooks
export * from './hooks/useViewportAwareness';

// Export styles
import './styles/chat.css';

// Export types directly from types folder
export * from '@/types/chat/types';

// Export services
export * from './services/LoggingService';
