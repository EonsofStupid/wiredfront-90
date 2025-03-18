
import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { Copy, User, Bot, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '../styles/cyber-theme.css';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasError = message.status === 'error';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const handleRetry = () => {
    // Add retry functionality here
    toast.info('Retrying message...');
  };
  
  return (
    <div 
      className={cn(
        "chat-message flex items-start gap-2 mb-4",
        isUser ? "flex-row-reverse" : "flex-row",
        "chat-scale-in"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        "max-w-[80%] px-4 py-2 rounded-lg relative group",
        isUser ? 
          "chat-message-user cyber-border-pink text-right ml-auto" : 
          "chat-message-assistant cyber-border text-left mr-auto",
        hasError && "error-pulse",
        "transition-all duration-300 hover:shadow-lg"
      )}>
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        
        <div className="text-xs opacity-50 mt-1 flex items-center justify-between">
          <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          
          {/* Message status or placeholder */}
          <span className="opacity-0">&nbsp;</span>
        </div>
        
        {/* Action buttons that appear on hover */}
        <div className={cn(
          "absolute top-2 right-2 flex gap-1",
          isHovered ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={copyToClipboard}
                  className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                >
                  {isCopied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-300" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Copy message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {hasError && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleRetry}
                    className="p-1 rounded-full bg-black/20 hover:bg-red-500/40 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3 text-red-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Retry message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Glassmorphism effect for message bubbles */}
        <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-md rounded-lg"></div>
      </div>
    </div>
  );
};

export default ChatMessage;
