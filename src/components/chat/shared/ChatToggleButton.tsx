
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useChatBridge } from '@/modules/ChatBridge';

interface ChatToggleButtonProps {
  onClick?: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  const chatBridge = useChatBridge();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      chatBridge.toggleChat();
    }
  };
  
  return (
    <Button 
      onClick={handleClick}
      className="fixed bottom-4 right-4 rounded-full p-3 bg-primary hover:bg-primary/90 shadow-lg"
      aria-label="Toggle chat"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatToggleButton;
