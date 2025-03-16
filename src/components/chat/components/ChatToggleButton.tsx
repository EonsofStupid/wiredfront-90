
import React from 'react';
import { MessageCircle } from 'lucide-react';
import '../styles/ChatButtonStyle.css';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="chat-toggle-button chat-cyber-border"
      aria-label="Open chat"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      <span>Chat</span>
    </button>
  );
};

export default ChatToggleButton;
