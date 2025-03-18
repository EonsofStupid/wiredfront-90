
import React, { useRef, useEffect } from 'react';
import { useChatMode } from '../providers/ChatModeProvider';
import { useChatStore } from '../store';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatContentProps {
  className?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ className }) => {
  const { mode, isEditorPage } = useChatMode();
  const { messages, isWaitingForResponse } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Render welcome message based on current mode
  const getWelcomeMessage = (): string => {
    switch (mode) {
      case 'dev':
      case 'developer':
        return 'I can help you with your code. Ask me anything about development!';
      case 'image':
        return 'Describe the image you want to generate, and I\'ll create it for you.';
      case 'training':
        return 'I\'m here to help you learn. What would you like to practice today?';
      default:
        return 'How can I help you today?';
    }
  };
  
  // Get mode color based on current mode
  const getModeColor = (): string => {
    switch (mode) {
      case 'dev':
      case 'developer':
        return 'neon-blue';
      case 'image':
        return 'neon-pink';
      case 'training':
        return 'green-400';
      default:
        return 'purple-400';
    }
  };
  
  return (
    <div className={`chat-content overflow-y-auto p-4 space-y-4 ${className || ''} transition-all duration-300 scan-lines`}>
      <div className="text-center opacity-60">
        <p className={`text-xs text-${getModeColor()} transition-colors duration-500`}>
          {new Date().toLocaleDateString()} • {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
        </p>
      </div>
      
      {messages.length === 0 ? (
        <div className="chat-message chat-message-assistant cyber-border cyber-pulse">
          <span className="cyber-glitch" data-text={getWelcomeMessage()}>
            {getWelcomeMessage()}
          </span>
        </div>
      ) : (
        messages.map((msg: Message, index) => (
          <ChatMessage key={msg.id} message={msg} />
        ))
      )}
      
      {isWaitingForResponse && (
        <div className="chat-message chat-message-assistant cyber-border opacity-70 flex items-center space-x-2 neon-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
      
      {/* Invisible div for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContent;
