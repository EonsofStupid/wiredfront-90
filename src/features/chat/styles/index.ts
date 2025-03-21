
import { coreZIndex } from "@/styles/theme/core-variables";

export const containerStyles = {
  container: 'fixed rounded-lg overflow-hidden bg-chat-bg border border-chat-border shadow-md z-[var(--z-chat)] transition-all duration-300',
  content: 'relative w-[var(--chat-width, 400px)] h-[var(--chat-height, 500px)] overflow-hidden bg-chat-bg',
  docked: 'fixed bottom-0 right-0 border-t border-l border-r rounded-t-lg rounded-b-none',
  dockedContent: 'h-[50vh] max-h-[600px] min-h-[300px]',
  header: 'flex items-center justify-between p-3 bg-chat-header-bg border-b border-chat-border',
  headerTitle: 'text-sm font-medium text-chat-text',
  headerActions: 'flex space-x-1',
  messageArea: 'flex-grow overflow-y-auto p-4',
  inputArea: 'p-3 border-t border-chat-border bg-chat-footer-bg',
  actionsRow: 'flex justify-between items-center mb-2',
  customScrollbar: 'scrollbar-thin scrollbar-thumb-chat-border scrollbar-track-transparent'
};

export const messageStyles = {
  container: 'flex flex-col space-y-4 mb-4',
  message: 'p-3 rounded-lg max-w-[85%]',
  user: 'self-end bg-chat-message-user-bg text-chat-message-user-text',
  assistant: 'self-start bg-chat-message-assistant-bg text-chat-message-assistant-text',
  system: 'self-start bg-chat-message-system-bg text-chat-message-system-text italic',
  timestamp: 'text-xs text-chat-text-muted mt-1',
  typing: 'animate-pulse'
};

export const iconStyles = {
  icon: 'transition-colors duration-200',
  button: 'h-8 w-8 rounded-full flex items-center justify-center',
  neonBlue: 'text-neon-blue hover:text-neon-blue/80',
  neonPink: 'text-neon-pink hover:text-neon-pink/80',
  neonPurple: 'text-purple-500 hover:text-purple-500/80',
  cyberGlow: 'shadow-[0_0_10px_rgba(0,255,255,0.7),0_0_20px_rgba(255,0,127,0.4)]'
};

export const inputStyles = {
  container: 'w-full relative',
  textarea: 'w-full p-2 rounded-md bg-chat-input-bg text-chat-text resize-none border border-chat-border focus:border-chat-button-bg focus:ring-1 focus:ring-chat-button-bg',
  actionsRow: 'flex justify-between items-center mb-2',
  button: 'rounded-md px-3 py-1.5 bg-chat-button-bg text-white hover:bg-chat-button-hover transition-colors'
};

// Chat animation keyframes and classes
export const chatAnimations = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  slideInRight: 'animate-slide-in-right',
  slideInLeft: 'animate-slide-in-left',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin'
};
