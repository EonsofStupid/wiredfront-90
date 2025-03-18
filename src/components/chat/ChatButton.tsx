
import React from 'react';
import { useChatStore } from './store/chatStore';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

/**
 * Floating chat button that toggles the chat interface
 */
export const ChatButton = () => {
  const { isOpen, toggleChat } = useChatStore();
  
  return (
    <motion.button
      className="chat-toggle-button"
      onClick={toggleChat}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-testid="chat-toggle-button"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="sr-only">Toggle Chat</span>
      
      <div className="chat-toggle-button-pulse"></div>
    </motion.button>
  );
};

export default ChatButton;
