
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';

interface ChatInputAreaProps {
  className?: string;
  disabled?: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ className, disabled = false }) => {
  const [input, setInput] = useState('');
  const { sendMessage } = useChatMessageStore();
  const { currentSession } = useChatSessionStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || disabled || !currentSession) return;
    
    try {
      await sendMessage(input, currentSession.id);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className={cn("chat-input-container", className)}>
      <form onSubmit={handleSubmit} className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        
        <button
          type="submit"
          className="chat-send-button"
          disabled={!input.trim() || disabled}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInputArea;
