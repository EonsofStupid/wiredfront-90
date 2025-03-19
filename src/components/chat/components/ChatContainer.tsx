
import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '../providers/ChatModeProvider';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { useChatTheme } from '@/hooks/chat/useChatTheme';
import { cn } from '@/lib/utils';
import { ChatHeader } from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputArea from './ChatInputArea';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import '../styles/chat-variables.css';
import '../styles/cyber-theme.css';

interface ChatContainerProps {
  className?: string;
  dockPosition?: 'bottom-right' | 'bottom-left';
}

export function ChatContainer({ className, dockPosition = 'bottom-right' }: ChatContainerProps) {
  const { isMinimized, docked, isWaitingForResponse, messages, addMessage } = useChatStore();
  const { currentMode, isEditorPage } = useChatMode();
  const { sendMessage } = useMessageAPI();
  const { currentTheme } = useChatTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };
  
  // Determine position class based on dockPosition
  const positionClass = dockPosition === 'bottom-right' ? 'right-4' : 'left-4';
  
  return (
    <div 
      className={cn(
        "chat-container overflow-hidden flex flex-col cyber-bg",
        !docked && 'cursor-grab active:cursor-grabbing',
        docked && `fixed bottom-4 ${positionClass}`,
        currentTheme === 'dark' ? 'theme-dark' : 'theme-light',
        className
      )}
    >
      <ErrorBoundary>
        <ChatHeader />
        
        {!isMinimized && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatContent className="flex-1" />
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {!isMinimized && (
          <ChatInputArea 
            onSendMessage={handleSendMessage} 
            disabled={isWaitingForResponse} 
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default ChatContainer;
