
import React from 'react';
import { X, Minimize2, Maximize2, Menu, Settings, LayoutGrid } from 'lucide-react';
import { useChatLayoutStore } from '@/stores/chat/layoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { CHAT_MODE_DISPLAY_NAMES } from '@/types/chat/modes';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onToggleSidebar?: () => void;
  onOpenModeSelector?: () => void;
  className?: string;
}

export function ChatHeader({ 
  onToggleSidebar, 
  onOpenModeSelector,
  className 
}: ChatHeaderProps) {
  const { 
    isMinimized, 
    toggleMinimize, 
    toggleOpen
  } = useChatLayoutStore();
  
  const { currentMode } = useChatModeStore();
  
  return (
    <div className={cn("chat-header", className)}>
      {!isMinimized && (
        <button
          type="button"
          onClick={onToggleSidebar}
          className="chat-header-button"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      )}
      
      {!isMinimized ? (
        <div 
          className="chat-header-title flex items-center gap-2"
          onClick={onOpenModeSelector}
        >
          <span>{CHAT_MODE_DISPLAY_NAMES[currentMode] || 'Chat'}</span>
          {onOpenModeSelector && (
            <LayoutGrid size={16} className="opacity-70" />
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
      
      <div className="chat-header-actions">
        <button
          type="button"
          onClick={toggleMinimize}
          className="chat-header-button"
          aria-label={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
        </button>
        
        <button
          type="button"
          onClick={toggleOpen}
          className="chat-header-button"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
