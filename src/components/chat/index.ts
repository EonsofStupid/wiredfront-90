/**
 * Chat Component Exports
 */

// Layout Components
export * from './layout/ChatContainer';
export * from './layout/ChatFooter';
export * from './layout/ChatHeader';
export * from './layout/ChatSidebar';

// Message Components
export * from './messages/MessageActions';
export * from './messages/MessageInput';
export * from './messages/MessageItem';
export * from './messages/MessageList';

// UI Components
export * from './ui/ChatAvatar';
export * from './ui/ChatBadge';
export * from './ui/ChatButton';
export * from './ui/ChatIcon';

// Hooks
export * from './hooks/useChat';
export * from './hooks/useChatMessages';
export * from './hooks/useChatSession';
export * from './hooks/useChatUI';

// Styles
import './styles/chat.css';

export { ChatManagerWithErrorBoundary as ChatManager } from './ChatManager';
export { ChatProvider } from './ChatProvider';
export { ChatErrorBoundary } from './components/ChatErrorBoundary';
export { DraggableChatWithErrorBoundary as DraggableChat } from './DraggableChat';
export { Message } from './Message';

// Re-export other components and utilities
export * from './ChatSidebar';
export * from './components';
export * from './features';
export * from './hooks';
export * from './messages';
export * from './messaging';
export * from './SessionManagement';
