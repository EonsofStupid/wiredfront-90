
import React from 'react';
import { Message } from '@/types/chat';
import CyberpunkMessage from '../ui/CyberpunkMessage';
import { Loader2 } from 'lucide-react';

interface CyberpunkChatMessagesProps {
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
}

const CyberpunkChatMessages: React.FC<CyberpunkChatMessagesProps> = ({
  messages,
  scrollRef,
  isLoading = false
}) => {
  return (
    <div 
      className="chat-cyberpunk-messages" 
      ref={scrollRef}
    >
      {messages.length === 0 ? (
        <div className="chat-cyberpunk-welcome">
          <div className="chat-cyberpunk-message chat-cyberpunk-message-system">
            <span className="chat-cyberpunk-glitch" data-text="How can I assist you today?">
              How can I assist you today?
            </span>
          </div>
        </div>
      ) : (
        <div className="chat-cyberpunk-message-list">
          {messages.map((message) => (
            <CyberpunkMessage
              key={message.id}
              message={message}
            />
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="chat-cyberpunk-message chat-cyberpunk-message-assistant chat-cyberpunk-loading">
          <div className="chat-cyberpunk-typing">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberpunkChatMessages;
