
import React from 'react';
import { useChatMode } from '../providers/ChatModeProvider';
import { useChatStore } from '../store/chatStore';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatContentProps {
  className?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ className }) => {
  const { currentMode, isEditorPage } = useChatMode();
  const { messages, isWaitingForResponse } = useChatStore();
  
  // Render welcome message based on current mode
  const getWelcomeMessage = (): string => {
    switch (currentMode) {
      case 'dev':
        return 'I can help you with your code. Ask me anything about development!';
      case 'image':
        return 'Describe the image you want to generate, and I\'ll create it for you.';
      case 'training':
        return 'I\'m here to help you learn. What would you like to practice today?';
      case 'planning':
        return 'Let\'s plan your project together. What are you working on?';
      case 'code':
        return 'I can help you write, review, or debug code. What are you working on?';
      default:
        return 'How can I help you today?';
    }
  };
  
  return (
    <div className={cn("chat-content overflow-y-auto p-4 space-y-4", className)}>
      <div className="text-center opacity-60">
        <p className="text-xs text-white/60">
          {new Date().toLocaleDateString()} • {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
        </p>
      </div>
      
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-message chat-message-assistant cyber-border cyber-pulse"
          >
            <span className="cyber-glitch" data-text={getWelcomeMessage()}>
              {getWelcomeMessage()}
            </span>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: Message, index) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isLast={index === messages.length - 1}
              />
            ))}
          </div>
        )}
        
        {isWaitingForResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-message chat-message-assistant cyber-border opacity-70 flex items-center space-x-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContent;
