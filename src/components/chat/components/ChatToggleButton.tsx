import React from 'react';
import { motion } from 'framer-motion';
import styles from './ChatToggleButton.module.css';
import { buttonStyles } from '@/constants/chat/button-styles';
import { ChatButtonSettings } from '@/types/chat/button-styles';

interface ChatToggleButtonProps {
  onClick: () => void;
  settings: ChatButtonSettings;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ 
  onClick,
  settings
}) => {
  const buttonStyle = buttonStyles[settings.style];
  const positionClass = settings.position.position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight;
  const sizeClass = styles[settings.size.base === 2.5 ? 'small' : settings.size.base === 4.5 ? 'large' : 'medium'];
  const styleClass = styles[settings.style];

  return (
    <motion.button
      onClick={onClick}
      className={`${styles.toggleButton} ${positionClass} ${sizeClass} ${styleClass}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconContainer}>
        {buttonStyle.icon.default}
        <span className="sr-only">Open Chat</span>
        <div className={styles.pulseEffect} />
      </div>
    </motion.button>
  );
};

export default ChatToggleButton;
