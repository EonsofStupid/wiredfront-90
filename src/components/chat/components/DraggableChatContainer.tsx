
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useChatStore } from '../store/chatStore';
import { ChatHeader } from './ChatHeader';
import { ChatModeDialog } from '../features/ModeSwitch/ChatModeDialog';
import { ChatMode } from '@/integrations/supabase/types/enums';
import '../styles/index.css';

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

  const { isMinimized, docked, scale } = useChatStore();
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  
  const handleModeSelect = (mode: ChatMode, providerId: string) => {
    useChatStore.getState().setCurrentMode(mode);
    
    // Find the provider by ID and set it as current
    const provider = useChatStore.getState().availableProviders.find(p => p.id === providerId);
    if (provider) {
      useChatStore.getState().updateCurrentProvider(provider);
    }
  };

  const handleToggleSidebar = () => {
    useChatStore.getState().toggleSidebar();
  };

  const transformStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={docked ? undefined : transformStyle}
      {...(docked ? {} : { ...listeners, ...attributes })}
      className={`chat-container chat-glass-card chat-neon-border overflow-hidden flex flex-col`}
    >
      <ChatHeader 
        onToggleSidebar={handleToggleSidebar}
        onOpenModeSelector={() => setModeDialogOpen(true)}
      />
      
      {!isMinimized && (
        <div 
          className="flex-1 overflow-y-auto p-4 chat-messages-container" 
          ref={scrollRef}
        >
          <div className="space-y-4">
            <div className="text-center opacity-60">
              <p className="text-xs text-white/60">
                {new Date().toLocaleDateString()} • {isEditorPage ? 'Editor' : 'Dashboard'} Mode
              </p>
            </div>
            
            <div className="chat-message chat-message-assistant">
              How can I help you today?
            </div>
          </div>
        </div>
      )}
      
      {!isMinimized && (
        <div className="chat-footer p-3 flex">
          <div className="flex-1 chat-input-container">
            <textarea 
              className="chat-input h-[40px] max-h-[120px] min-h-[40px]"
              placeholder="Type a message..."
              rows={1}
            />
          </div>
        </div>
      )}
      
      <ChatModeDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
        onModeSelect={handleModeSelect}
      />
    </div>
  );
};

export default DraggableChatContainer;
