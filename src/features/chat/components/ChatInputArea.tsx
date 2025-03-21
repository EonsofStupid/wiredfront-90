
import React, { useRef, useState, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';

interface ChatInputAreaProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputArea({
  className,
  placeholder = 'Type a message...',
  disabled = false
}: ChatInputAreaProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { sendMessage } = useChatMessageStore();
  const { currentSession } = useChatSessionStore();
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);
  
  // Handle Cmd/Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || disabled || !currentSession) return;
    
    try {
      await sendMessage(message.trim(), currentSession.id);
      setMessage('');
      
      // Reset input height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className={cn("chat-input-area", className)}>
      <button
        type="button"
        className="chat-input-button text-white/60 hover:text-white"
        aria-label="Attach file"
      >
        <Paperclip size={20} />
      </button>
      
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="chat-input"
        aria-label="Message input"
      />
      
      {message.trim() ? (
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || !message.trim()}
          className="chat-send-button"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      ) : (
        <button
          type="button"
          className="chat-input-button text-white/60 hover:text-white"
          aria-label="Voice input"
        >
          <Mic size={20} />
        </button>
      )}
    </div>
  );
}
