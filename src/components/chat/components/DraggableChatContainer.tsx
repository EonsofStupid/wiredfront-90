import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { useChatStore } from '../store';
import { supabaseModeToStoreMode } from '@/utils/modeConversion';
import { Message, ChatMode } from '@/types/chat';
import ChatInputArea from './ChatInputArea';
import { ChatIconStack } from './ChatIconStack';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { ChatHeader } from './ChatHeader';
import { ChatModeDialog } from '../features/ModeSwitch/ChatModeDialog';
import ChatMessage from './ChatMessage';
import '../styles/index.css';
import '../styles/cyber-theme.css';

interface DraggableChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

const DraggableChatContainer: React.FC<DraggableChatContainerProps> = ({ 
  scrollRef,
  isEditorPage
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-chat',
  });

  const { 
    isMinimized, 
    docked, 
    scale, 
    messages, 
    addMessage 
  } = useChatStore();
  
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const { sendMessage, isLoading } = useMessageAPI();
  const [typing, setTyping] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      setTyping(true);
      const timeout = setTimeout(() => setTyping(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);
  
  const handleModeSelect = (mode: ChatMode, providerId: string) => {
    // Convert Supabase mode to store mode
    const storeMode = supabaseModeToStoreMode(mode);
    useChatStore.getState().setCurrentMode(storeMode);
    
    // Find the provider by ID and set it as current
    const provider = useChatStore.getState().availableProviders.find(p => p.id === providerId);
    if (provider) {
      useChatStore.getState().updateCurrentProvider(provider);
    }
  };

  const handleToggleSidebar = () => {
    useChatStore.getState().toggleSidebar();
  };

  const transformStyle = transform && !docked ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  return (
    <div
      ref={setNodeRef}
      style={transformStyle}
      {...(docked ? {} : { ...listeners, ...attributes })}
      className={`chat-container chat-glass-card chat-neon-border overflow-hidden flex flex-col cyber-bg relative ${!docked && 'cursor-grab active:cursor-grabbing'}`}
    >
      <ChatHeader 
        onToggleSidebar={handleToggleSidebar}
        onOpenModeSelector={() => setModeDialogOpen(true)}
      />
      
      {!isMinimized && (
        <div 
          className="flex-1 overflow-y-auto p-4 chat-messages-container cyber-bg" 
          ref={scrollRef}
        >
          <div className="space-y-4">
            <div className="text-center opacity-60">
              <p className="text-xs text-white/60">
                {new Date().toLocaleDateString()} • {isEditorPage ? 'Editor' : 'Dashboard'} Mode
              </p>
            </div>
            
            {messages.length === 0 ? (
              <div className="chat-message chat-message-assistant cyber-border cyber-pulse">
                <span className="cyber-glitch" data-text="How can I help you today?">How can I help you today?</span>
              </div>
            ) : (
              messages.map((msg: Message) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            
            {typing && (
              <div className="chat-message chat-message-assistant cyber-border opacity-70">
                <div className="typing-dots">Assistant is typing</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!isMinimized && (
        <ChatInputArea onSendMessage={handleSendMessage} />
      )}
      
      <ChatModeDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
        onModeSelect={handleModeSelect}
      />
      
      <ChatIconStack />
    </div>
  );
};

export default DraggableChatContainer;
