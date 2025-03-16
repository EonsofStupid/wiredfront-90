
import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import '../styles/ChatButtonStyle.css';
import '../styles/cyber-theme.css';

interface ChatToggleButtonProps {
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="chat-toggle-button cyber-button cyber-pulse"
      aria-label="Open AI Assistant"
    >
      <div className="flex items-center justify-center gap-2">
        <Zap className="h-5 w-5 text-cyan-400" />
        <span className="font-medium tracking-wide">AI ASSIST</span>
      </div>
      <div className="cyber-scanline absolute inset-0 pointer-events-none"></div>
    </button>
  );
};

export default ChatToggleButton;
