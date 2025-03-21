
import React from "react";
import { Message } from "@/types/chat/types";
import { User, Bot, Terminal, Check, Clock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/utils/dateUtils";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onRetry?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast, onRetry }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  // Get message status, handle both property names for backward compatibility
  const messageStatus = message.message_status || message.status || 'sent';
  const isStreaming = messageStatus === 'pending';
  
  // Get timestamp from any of the possible timestamp fields
  const timestamp = message.timestamp || message.created_at || new Date().toISOString();
  
  // Determine icon based on role and type
  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4 text-neon-pink" />;
    if (isSystem) return <Terminal className="h-4 w-4 text-neon-green" />;
    return <Bot className="h-4 w-4 text-neon-blue" />;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "chat-message flex items-start gap-2 mb-4",
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
          {messageStatus === 'pending' && <Clock className="h-3 w-3 animate-spin" />}
          {formatRelativeTime(new Date(timestamp))}
          {!isUser && !isSystem && <Sparkles className="h-3 w-3 ml-1" />}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
