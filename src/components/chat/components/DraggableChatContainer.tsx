
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
import { ActionIconStack } from '../ui/action-stack';
import { ActionItem } from '@/types/chat';
import { ActionIcons, ModeIcons } from '../icons';
import { useNavigation } from '../hooks/useNavigation';
import { DockPanel } from '../ui/dock-panel';
import '../styles/index.css';
import '../styles/cyber-theme.css';
import '../styles/icons.css';

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
    availableProviders,
    currentMode
  } = useChatStore();
  
  const { navigateByMode } = useNavigation();
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const { sendMessage, isLoading } = useMessageAPI();
  const [typing, setTyping] = useState(false);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  
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
  const modeActionItems: ActionItem[] = [
    {
      id: 'chat-mode',
      icon: ModeIcons.chat,
      label: 'Chat Mode',
      onClick: () => handleModeSelect('chat', availableProviders[0]?.id || ''),
      variant: 'ghost' as const,
      active: currentMode === 'chat',
      color: 'rgba(0, 255, 255, 0.8)',
      glow: currentMode === 'chat'
    },
    {
      id: 'developer-mode',
      icon: ModeIcons.dev,
      label: 'Developer Mode',
      onClick: () => handleModeSelect('dev', availableProviders[0]?.id || ''),
      variant: 'ghost' as const,
      active: currentMode === 'dev',
      color: 'rgba(255, 105, 180, 0.8)',
      glow: currentMode === 'dev'
    },
    {
      id: 'image-mode',
      icon: ModeIcons.image,
      label: 'Image Mode',
      onClick: () => handleModeSelect('image', availableProviders[0]?.id || ''),
      variant: 'ghost' as const,
      active: currentMode === 'image',
      color: 'rgba(138, 43, 226, 0.8)',
      glow: currentMode === 'image'
    },
    {
      id: 'training-mode',
      icon: ModeIcons.training,
      label: 'Training Mode',
      onClick: () => handleModeSelect('training', availableProviders[0]?.id || ''),
      variant: 'ghost' as const,
      active: currentMode === 'training',
      color: 'rgba(64, 224, 208, 0.8)',
      glow: currentMode === 'training'
    },
  ];
  
  // Tool action items
  const toolActionItems: ActionItem[] = [
    {
      id: 'command',
      icon: ActionIcons.command,
      label: 'Command Palette',
      onClick: () => console.log('Command palette clicked'),
      variant: 'ghost' as const,
      color: 'rgba(255, 255, 255, 0.8)'
    },
    {
      id: 'memory',
      icon: ActionIcons.memory,
      label: 'AI Memory',
      onClick: () => setShowMemoryPanel(!showMemoryPanel),
      variant: 'ghost' as const,
      active: showMemoryPanel,
      color: 'rgba(0, 255, 255, 0.8)',
      glow: showMemoryPanel
    },
    {
      id: 'search',
      icon: ActionIcons.search,
      label: 'Knowledge Search',
      onClick: () => console.log('Search clicked'),
      variant: 'ghost' as const,
      color: 'rgba(255, 105, 180, 0.8)'
    },
    {
      id: 'settings',
      icon: ActionIcons.settings,
      label: 'Chat Settings',
      onClick: () => console.log('Settings clicked'),
      variant: 'ghost' as const,
      color: 'rgba(255, 255, 255, 0.7)'
    },
  ];

  return (
    <>
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
            actions={modeActionItems}
            position="right"
            orientation="vertical"
            className="-right-12 space-y-2 opacity-70 hover:opacity-100"
            showLabels={true}
          />
        )}
        
        {!isMinimized && (
          <ActionIconStack 
            actions={toolActionItems}
            position="left"
            orientation="vertical"
            className="-left-12 space-y-2 opacity-70 hover:opacity-100"
            showLabels={true}
          />
        )}
      </div>
      
      {showMemoryPanel && (
        <DockPanel
          title="AI Memory"
          position="right"
          defaultIsPinned={false}
          width={300}
          onClose={() => setShowMemoryPanel(false)}
        >
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Stored Memories</h3>
            <div className="space-y-2">
              <div className="bg-black/30 border border-white/10 rounded p-2">
                <div className="text-xs text-white/70">Project: WiredFront</div>
                <div className="text-sm">The main goal is to create a cyberpunk-themed UI</div>
              </div>
              <div className="bg-black/30 border border-white/10 rounded p-2">
                <div className="text-xs text-white/70">Chat Functionality</div>
                <div className="text-sm">Chat should support multiple modes including developer mode</div>
              </div>
            </div>
          </div>
        </DockPanel>
      )}
    </>
  );
};

export default DraggableChatContainer;
