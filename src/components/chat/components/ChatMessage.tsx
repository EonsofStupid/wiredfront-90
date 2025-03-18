
import React from 'react';
import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/cyber-theme.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "chat-message flex items-start gap-2 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        isUser ? "bg-neon-pink/20" : "bg-neon-blue/20",
        "cyber-border"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-neon-pink" />
        ) : (
          <Bot className="h-4 w-4 text-neon-blue" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-lg",
        isUser ? 
          "chat-message-user cyber-border-pink text-right ml-auto" : 
          "chat-message-assistant cyber-border text-left mr-auto"
      )}>
        <div className="text-sm">
          {message.content}
        </div>
        
        <div className="text-xs opacity-50 mt-1">
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
