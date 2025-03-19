
import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '@/hooks/chat/useChatMode';
import { useChatLayoutStore } from '@/components/chat/store/chatLayoutStore';
import { Button } from '@/components/ui/button';
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Menu, 
  Github, 
  Bell, 
  Database, 
  Zap,
  Code,
  Image,
  BookOpen,
  Pin,
  PinOff
} from 'lucide-react';
import '../styles/cyber-theme.css';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onOpenModeSelector: () => void;
}

export function ChatHeader({ onToggleSidebar, onOpenModeSelector }: ChatHeaderProps) {
  const { 
    isWaitingForResponse,
    currentProvider 
  } = useChatStore();
  
  const { currentMode } = useChatMode();
  const { 
    isMinimized, 
    toggleMinimized, 
    docked, 
    toggleDocked
  } = useChatLayoutStore();
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const getModeIcon = () => {
    switch (currentMode) {
      case 'dev': return <Code className="h-4 w-4 text-cyan-400" />;
      case 'image': return <Image className="h-4 w-4 text-pink-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-purple-400" />;
      default: return <Zap className="h-4 w-4 text-cyan-400" />;
    }
  };
  
  const handleCloseChat = () => {
    // Close chat functionality
  };
  
  return (
    <div className="chat-header h-12 px-3 flex items-center justify-between cyber-bg cyber-border">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-cyan-400 hover:bg-cyan-400/10"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          data-testid="sidebar-toggle"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-8 text-xs chat-control-button cyber-pulse"
          onClick={onOpenModeSelector}
          aria-label="Select AI mode"
        >
          <span className="flex items-center gap-1">
            {getModeIcon()}
            <span className="capitalize">{currentMode}</span>
          </span>
        </Button>
        
        <span className="ml-2 text-xs text-white/40">|</span>
        
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-8 text-xs chat-control-button"
          onClick={() => setStatusDialogOpen(true)}
          aria-label="AI Provider Status"
        >
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3 text-green-400" />
            <span>{currentProvider?.name || 'Default'}</span>
          </span>
        </Button>
      </div>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={toggleDocked}
          aria-label={docked ? "Undock chat" : "Dock chat"}
        >
          {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={toggleMinimized}
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 text-red-400 hover:bg-red-400/10"
          onClick={handleCloseChat}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
