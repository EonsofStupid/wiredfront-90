
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useChatMode } from '../providers/ChatModeProvider';
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/integrations/supabase/types/enums';

interface ChatToggleButtonProps extends ButtonProps {
  showChatText?: boolean;
  customLabel?: string;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ 
  showChatText = false, 
  customLabel,
  className = '',
  ...props 
}) => {
  const { mode, setMode } = useChatMode();
  const { isOpen, toggleChat } = useChatStore();

  const handleToggle = () => {
    toggleChat();
  };

  const getButtonLabel = () => {
    if (customLabel) {
      return customLabel;
    }

    if (mode === 'dev') {
      return showChatText ? "Open Developer Chat" : "Chat";
    } else if (mode === 'chat-only') {
      return showChatText ? "Open Chat" : "Chat";
    } else {
      return showChatText ? (isOpen ? "Close Chat" : "Open Chat") : "Chat";
    }
  };

  // Get icon based on mode
  const getIconClass = () => {
    if (mode === 'dev') {
      return "code-icon";
    } else if (mode === 'chat-only') {
      return "chat-icon";
    } else {
      return "chat-icon";
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`chat-toggle-button ${className}`}
      {...props}
    >
      <span className={getIconClass()}></span>
      {getButtonLabel()}
    </Button>
  );
};

export default ChatToggleButton;
