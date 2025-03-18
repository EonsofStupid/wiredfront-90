import React from 'react';
import { MessageSquare, MessageCircle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './ChatToggleButton.module.css';

interface ChatToggleButtonProps {
  onClick: () => void;
  variant?: 'default' | 'circle' | 'ai';
  size?: 'default' | 'sm' | 'lg';
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ 
  onClick, 
  variant = 'default',
  size = 'default'
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'circle':
        return <MessageCircle className="h-5 w-5" />;
      case 'ai':
        return <Bot className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles.small;
      case 'lg':
        return styles.large;
      default:
        return '';
    }
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={`${styles.toggleButton} ${getSizeClass()}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconContainer}>
        {getIcon()}
        <span className="sr-only">Open Chat</span>
        <div className={styles.pulseEffect} />
      </div>
    </motion.button>
  );
};

export default ChatToggleButton;
