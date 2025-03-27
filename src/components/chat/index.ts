
// Core exports
export { ChatContainer } from './ChatContainer';
export { ChatProvider, useChat } from './ChatProvider';

// Feature exports
export { ChatModeDialog } from './features/ModeSwitch';
export { VoiceToTextButton } from './features/voice-to-text/VoiceToTextButton';
export { StatusButton } from './features/status-button';
export { RAGModule } from './features/knowledge/RAGModule';
export { GitHubSyncModule } from './features/github-integration/GitHubSyncModule';
export { NotificationsModule } from './features/notifications/NotificationsModule';
export { ModeSelectionDialog, NewChatButton, SessionActions } from './features/conversations';

// Structure exports
export { Message } from './chat-structure/messages';
export { ChatHeader } from './chat-structure/header';
export { ChatContent } from './chat-structure/content';
export { ChatInputModule } from './chat-structure/input';
export { ChatSidebar } from './chat-structure/sidebar';

// Shared exports
export { Spinner, MessageSkeleton, ChatToggleButton } from './shared';

// Store exports
export { useChatStore } from './store/chatStore';
