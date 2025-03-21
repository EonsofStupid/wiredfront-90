
import React, { useState, KeyboardEvent } from 'react';
import { SendHorizontal, Paperclip, MicIcon, Image, CornerUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChat } from '../hooks/useChat';

interface ChatInputAreaProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  className,
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const { sendMessage, isWaitingForResponse, currentMode } = useChat();
  
  const handleSend = async () => {
    if (message.trim() === '' || disabled || isWaitingForResponse) return;
    
    try {
      // Use the provided handler or fall back to our useChat hook
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        await sendMessage(message);
      }
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Icons based on current mode
  const getActionIcon = () => {
    switch (currentMode) {
      case 'image': return <Image className="h-5 w-5 text-neon-pink" />;
      case 'dev': return <CornerUpRight className="h-5 w-5 text-neon-green" />;
      default: return <SendHorizontal className="h-5 w-5 text-neon-blue" />;
    }
  };
  
  return (
    <div className={cn("chat-input-area p-3 border-t border-white/10", className)}>
      <div className="flex items-end gap-2">
        <textarea
          className="w-full bg-black/30 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue text-sm resize-none min-h-[60px] max-h-[200px]"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isWaitingForResponse}
          rows={1}
          style={{ overflow: 'auto' }}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "cyber-button h-10 w-10 flex items-center justify-center rounded-full transition-colors",
            message.trim() === '' || disabled || isWaitingForResponse
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-neon-blue hover:bg-neon-blue/80"
          )}
          onClick={handleSend}
          disabled={message.trim() === '' || disabled || isWaitingForResponse}
          aria-label="Send message"
        >
          {getActionIcon()}
        </motion.button>
      </div>
      
      <div className="flex justify-between mt-2">
        <div className="flex gap-2">
          <button className="text-white/40 hover:text-white/70 p-1" aria-label="Attach file">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="text-white/40 hover:text-white/70 p-1" aria-label="Voice message">
            <MicIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-xs text-white/30">
          {disabled || isWaitingForResponse ? 'AI is typing...' : 'Press Enter to send'}
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;
