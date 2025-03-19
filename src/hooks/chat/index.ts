
/**
 * Export all chat-related hooks
 */

// Core chat hooks
export { default as useChatLayout } from './useChatLayout';
export { default as useJotaiChatLayout } from './useJotaiChatLayout';
export { default as useJotaiChatDocking } from './useJotaiChatDocking';
export { default as useChatMode } from './useChatMode';
export { default as useChatMessages } from './useChatMessages';

// Provider hooks
export { useAIProviders } from '../useAIProviders';
export { useChatProvider } from '../useChatProvider';

// Feature hooks
export { useMessageAPI } from '../useMessageAPI';
export { useChatTheme } from '../useChatTheme';
export { useUserChatPreferences } from '../useUserChatPreferences';

// UI hooks
export { useAutoScroll } from '../useAutoScroll';
export { useModeSwitch } from '../useModeSwitch';
export { useViewportAwareness } from '../useViewportAwareness';
export { useErrorBoundary } from '../useErrorBoundary';
