
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useChatStore } from '../store/chatStore';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { ChatHeader } from './ChatHeader';
import { ChatModeDialog } from '../features/ModeSwitch/ChatModeDialog';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { supabaseModeToStoreMode } from '@/utils/modeConversion';
import ChatContent from './ChatContent';
import ChatInputArea from './ChatInputArea';
import { ActionIconStack, ActionItem } from '../ui/ActionIconStack';
import { MessageSquare, Code, Image, BookOpen } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
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
    addMessage,
    setCurrentMode,
    updateCurrentProvider,
    availableProviders
  } = useChatStore();
  
  const { navigateByMode } = useNavigation();
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const { sendMessage, isLoading } = useMessageAPI();
  const [typing, setTyping] = useState(false);
  
  // Mode selection actions
  const handleModeSelect = (mode: SupabaseChatMode, providerId: string) => {
    // Convert Supabase mode to store mode
    const storeMode = supabaseModeToStoreMode(mode);
    setCurrentMode(storeMode);
    
    // Find the provider by ID and set it as current
    const provider = availableProviders.find(p => p.id === providerId);
    if (provider) {
      updateCurrentProvider(provider);
    }
    
    // Navigate to the appropriate page based on the selected mode
    navigateByMode(mode);
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
  
  // Define quick action buttons
  const actionItems: ActionItem[] = [
    {
      id: 'chat-mode',
      icon: MessageSquare,
      label: 'Chat Mode',
      onClick: () => handleModeSelect('chat', availableProviders[0]?.id || ''),
      variant: 'ghost'
    },
    {
      id: 'developer-mode',
      icon: Code,
      label: 'Developer Mode',
      onClick: () => handleModeSelect('dev', availableProviders[0]?.id || ''),
      variant: 'ghost'
    },
    {
      id: 'image-mode',
      icon: Image,
      label: 'Image Mode',
      onClick: () => handleModeSelect('image', availableProviders[0]?.id || ''),
      variant: 'ghost'
    },
    {
      id: 'training-mode',
      icon: BookOpen,
      label: 'Training Mode',
      onClick: () => handleModeSelect('training', availableProviders[0]?.id || ''),
      variant: 'ghost'
    },
  ];

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
          className="flex-1 overflow-y-auto chat-messages-container cyber-bg" 
          ref={scrollRef}
        >
          <ChatContent isTyping={typing} />
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
      
      {!isMinimized && (
        <ActionIconStack 
          actions={actionItems}
          position="right"
          orientation="vertical"
          className="-right-12 space-y-2 opacity-70 hover:opacity-100"
        />
      )}
    </div>
  );
};

export default DraggableChatContainer;
