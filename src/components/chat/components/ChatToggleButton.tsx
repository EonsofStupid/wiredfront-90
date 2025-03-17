
import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import '../styles/ChatButtonStyle.css';
import '../styles/cyber-theme.css';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  const { position } = useChatStore();
  
  const positionClass = typeof position === 'string' && position === 'bottom-left' 
    ? 'chat-button-left' 
    : 'chat-button-right';
  
  return (
    <button
      onClick={onClick}
      className={`chat-toggle-button cyber-pulse-blue ${positionClass}`}
      aria-label="Open AI Assistant"
      data-testid="chat-toggle-button"
    >
      <Zap className="h-5 w-5 text-white" />
      <div className="cyber-scanline absolute inset-0 pointer-events-none rounded-full"></div>
    </button>
  );
};

export default ChatToggleButton;
