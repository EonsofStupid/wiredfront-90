
import React from 'react';
import { MessageSquare, MessageCircle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 w-10';
      case 'lg':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        getSizeClasses(),
        "fixed bottom-4 right-4 z-[var(--z-chat-button)]",
        "rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600",
        "flex items-center justify-center shadow-lg",
        "border border-white/10",
        "text-white hover:text-white/90",
        "transition-all duration-300 ease-out"
      )}
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {getIcon()}
      <span className="sr-only">Open Chat</span>
      
      {/* Ripple/pulse effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-white"
        initial={{ opacity: 0.3, scale: 1 }}
        animate={{ 
          opacity: 0,
          scale: 1.5,
          transition: { repeat: Infinity, duration: 2, repeatDelay: 1 }
        }}
      />
    </motion.button>
  );
};

export default ChatToggleButton;
