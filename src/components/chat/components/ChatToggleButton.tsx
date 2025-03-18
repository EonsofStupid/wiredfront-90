
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-chat-neon-purple hover:bg-chat-neon-purple/80 shadow-lg p-0 flex items-center justify-center z-[9700]"
      onClick={onClick}
      aria-label="Open chat"
      style={{
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
      }}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatToggleButton;
