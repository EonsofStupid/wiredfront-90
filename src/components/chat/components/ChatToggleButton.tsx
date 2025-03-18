
import React from 'react';
import { MessageSquare } from 'lucide-react';
import '../styles/index.css';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      className="chat-toggle-button"
      onClick={onClick}
      aria-label="Open chat"
    >
      <div className="chat-toggle-button-pulse"></div>
      <MessageSquare className="h-6 w-6" />
    </button>
  );
};

export default ChatToggleButton;
