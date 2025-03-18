
import React, { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { User, Bot, ArrowRight, Sparkles, Terminal, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/cyber-theme.css';
import '../styles/animations.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isStreaming = message.message_status === 'pending';
  
  // Determine icon based on role and type
  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4 text-neon-pink" />;
    if (isSystem) return <Terminal className="h-4 w-4 text-neon-green" />;
    return <Bot className="h-4 w-4 text-neon-blue" />;
  };
  
  // Add animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={cn(
        "chat-message flex items-start gap-2 mb-4 opacity-0",
        isVisible && "opacity-100 transition-opacity duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        isUser ? "bg-neon-pink/20" : isSystem ? "bg-neon-green/20" : "bg-neon-blue/20",
        isUser ? "cyber-border-pink" : isSystem ? "cyber-border-green" : "cyber-border"
      )}>
        {getIcon()}
      </div>
      
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-lg",
        isUser ? 
          "chat-message-user cyber-border-pink text-right ml-auto" : 
          isSystem ?
            "bg-dark-purple/40 cyber-border-green text-left mr-auto" :
            "chat-message-assistant cyber-border text-left mr-auto",
        isStreaming && "chat-pulse"
      )}>
        <div className="text-sm">
          {message.content}
          {isStreaming && (
            <span className="chat-typing-indicator ml-1">
              <span></span>
              <span></span>
              <span></span>
            </span>
          )}
        </div>
        
        <div className="text-xs opacity-50 mt-1 flex items-center justify-end gap-1">
          {isUser && <ArrowRight className="h-3 w-3" />}
          {message.message_status === 'pending' && <Clock className="h-3 w-3 animate-spin" />}
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {!isUser && !isSystem && <Sparkles className="h-3 w-3 ml-1" />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
