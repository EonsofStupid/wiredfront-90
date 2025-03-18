import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { FloatingChatButton } from '../floating-button/FloatingChatButton';

interface ChatToggleButtonProps {
  onClick: () => void;
  useIsolated?: boolean;
}

/**
 * @deprecated Use the FloatingChatButton component instead for better isolation
 */
const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick, useIsolated = false }) => {
  // If asked to use isolated version, render the new component
  if (useIsolated) {
    return <FloatingChatButton />;
  }
  
  // Otherwise, provide the legacy implementation
  return (
    <Button
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-chat-neon-purple hover:bg-chat-neon-purple/80 shadow-lg p-0 flex items-center justify-center z-[var(--z-chat)]"
      onClick={onClick}
      aria-label="Open chat"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatToggleButton;
