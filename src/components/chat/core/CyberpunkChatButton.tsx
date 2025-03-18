
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../store/chatStore';
import { useChatUIStore } from '@/stores/chat-ui';

interface CyberpunkChatButtonProps {
  onClick: () => void;
}

const CyberpunkChatButton: React.FC<CyberpunkChatButtonProps> = ({ onClick }) => {
  const { position } = useChatUIStore();
  
  // Determine position class
  const positionClass = typeof position === 'string' && position === 'bottom-right'
    ? 'right-4'
    : 'left-4';
  
  return (
    <motion.button
      className={`chat-cyberpunk-button-float fixed bottom-4 ${positionClass} z-[var(--chat-cyber-z-container)]`}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="chat-cyberpunk-button-inner">
        <MessageSquare className="chat-cyberpunk-button-icon" />
        <span className="chat-cyberpunk-button-text">Chat</span>
      </div>
      <div className="chat-cyberpunk-button-glow"></div>
    </motion.button>
  );
};

export default CyberpunkChatButton;
