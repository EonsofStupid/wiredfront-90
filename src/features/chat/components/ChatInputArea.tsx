
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';

interface ChatInputAreaProps {
  className?: string;
  disabled?: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ className, disabled = false }) => {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChatMessageStore();
  const { currentSession } = useChatSessionStore();
  const { currentMode } = useChatModeStore();
  
  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || disabled || !currentSession) return;
    
    try {
      await sendMessage(input, currentSession.id);
      setInput('');
      setRows(1);
      
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Adjust rows based on content length
    const lineCount = e.target.value.split('\n').length;
    setRows(Math.min(Math.max(lineCount, 1), 5));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  const getPlaceholder = () => {
    switch (currentMode) {
      case 'dev':
        return 'Ask about your code...';
      case 'image':
        return 'Describe an image to generate...';
      case 'training':
        return 'What would you like to learn?';
      case 'planning':
        return 'Describe your project plan...';
      case 'code':
        return 'Ask about code...';
      default:
        return 'Type a message...';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("p-3 border-t border-white/10 bg-black/20", className)}>
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="w-full bg-black/30 border-white/10 focus:border-neon-blue/30 resize-none py-2 pr-12 rounded-md h-auto max-h-24 text-sm chat-input"
            rows={rows}
            disabled={disabled}
          />
          
          <div className="absolute right-2 bottom-2">
            <button 
              type="button" 
              className="h-7 w-7 text-white/40 hover:text-neon-pink bg-transparent border-none rounded-md flex items-center justify-center"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            className="h-9 w-9 rounded-full bg-black/20 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white flex items-center justify-center"
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </button>
          
          <button 
            type="button"
            className="h-9 w-9 rounded-full bg-black/20 border border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20 hover:text-white flex items-center justify-center"
            disabled={disabled}
          >
            <Sparkles className="h-4 w-4" />
          </button>
          
          <button 
            type="submit"
            disabled={!input.trim() || disabled}
            className="h-9 w-9 rounded-full p-0 bg-gradient-to-r from-neon-blue to-neon-blue/70 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="text-[10px] text-right mt-1 text-white/30">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInputArea;
