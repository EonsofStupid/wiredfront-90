
import React from 'react';
import { useChatMode } from '../providers/ChatModeProvider';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { useMessageStore } from '../messaging/MessageManager';
import { Spinner } from './Spinner';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../store/chatStore';

interface ChatContentProps {
  className?: string;
  isTyping?: boolean;
}

const ChatContent: React.FC<ChatContentProps> = ({
  className = '',
  isTyping = false
}) => {
  const { mode, isEditorPage } = useChatMode();
  const { messages } = useMessageStore();
  const { ui } = useChatStore();
  
  // Render welcome message based on current mode
  const getWelcomeMessage = () => {
    switch(mode) {
      case 'dev':
      case 'developer':
        return "Welcome to Developer Mode. How can I assist with your coding?";
      case 'image':
        return "Image Generation Mode activated. Describe what you'd like to create.";
      case 'training':
        return "Training Mode ready. What would you like to learn today?";
      case 'chat':
      case 'standard':
      default:
        return "How can I help you today?";
    }
  };
  
  return (
    <div className={`chat-content overflow-y-auto p-4 flex-1 ${className}`}>
      {ui.sessionLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner size="md" label="Loading session..." />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center opacity-60">
            <p className="text-xs text-white/60">
              {new Date().toLocaleDateString()} • {isEditorPage ? 'Editor' : 'Chat'} Mode
            </p>
          </div>
          
          {messages.length === 0 ? (
            <div className="chat-message chat-message-assistant cyber-border cyber-pulse">
              <span className="cyber-glitch" data-text={getWelcomeMessage()}>
                {getWelcomeMessage()}
              </span>
            </div>
          ) : (
            messages.map((msg: Message) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          
          {isTyping && (
            <div className="chat-message chat-message-assistant cyber-border opacity-70">
              <div className="typing-dots">Assistant is typing</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContent;
