
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useChatMode } from '../providers/ChatModeProvider';
import { useChatStore } from '../store/chatStore';
import { MessageCircle, Code, Image } from 'lucide-react';
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
  const { mode } = useChatMode();
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
  const getIcon = () => {
    if (mode === 'dev') {
      return <Code className="h-4 w-4 mr-2" />;
    } else if (mode === 'image') {
      return <Image className="h-4 w-4 mr-2" />;
    } else {
      return <MessageCircle className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleToggle}
      className={`chat-toggle-button fixed bottom-4 right-4 z-[var(--z-chat)] shadow-md ${className}`}
      {...props}
    >
      {getIcon()}
      {getButtonLabel()}
    </Button>
  );
};

export default ChatToggleButton;
