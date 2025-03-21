
import React, { useRef, useEffect } from 'react';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { Message } from '@/types/chat/types';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { useChat } from '../hooks/useChat';

interface ChatContentProps {
  className?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ className }) => {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { 
    currentMode, 
    messages, 
    isLoading,
    getWelcomeMessage 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const isWaitingForResponse = isLoading || false;
  
  return (
    <div className={cn("chat-content overflow-y-auto p-4 space-y-4", className)}>
      <div className="text-center opacity-60">
        <p className="text-xs text-white/60">
          {new Date().toLocaleDateString()} • {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
          {isEditorPage && ' • Editor View'}
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
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContent;
