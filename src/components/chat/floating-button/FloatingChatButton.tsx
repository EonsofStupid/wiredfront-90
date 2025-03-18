
import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useSettingsStore } from '@/stores/settings';
import './floating-button.css';

/**
 * A completely isolated floating chat button component
 * that maintains its own state and styling independent of other chat components
 */
export const FloatingChatButton: React.FC = () => {
  const { toggleChat, position } = useChatStore();
  
  // Connect to settings to respect user preferences
  const { preferences } = useSettingsStore();
  
  // Determine position class based on the chat position state
  const positionClass = typeof position === 'string' && position === 'bottom-left' 
    ? 'floating-chat-button--left' 
    : 'floating-chat-button--right';
    
  return (
    <button
      className={`floating-chat-button ${positionClass}`}
      onClick={toggleChat}
      aria-label="Open chat"
    >
      <MessageSquare className="floating-chat-button__icon" />
    </button>
  );
};

export default FloatingChatButton;
