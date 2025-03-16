
import React, { useState } from 'react';
import { useChatStore } from '../store';
import { Button } from '@/components/ui/button';
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Menu, 
  Github, 
  Bell, 
  Database, 
  LayoutGrid,
  Zap,
  Code,
  Image,
  BookOpen
} from 'lucide-react';
import { ChatPositionToggle } from './ChatPositionToggle';
import { AIProviderStatusDialog } from '../features/status-button/AIProviderStatusDialog';
import '../styles/cyber-theme.css';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onOpenModeSelector: () => void;
}

export function ChatHeader({ onToggleSidebar, onOpenModeSelector }: ChatHeaderProps) {
  const { 
    toggleMinimize, 
    isMinimized, 
    closeChat, 
    currentMode, 
    currentProvider,
    availableProviders
  } = useChatStore();
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const getModeIcon = () => {
    switch (currentMode) {
      case 'dev': return <Code className="h-4 w-4 text-cyan-400" />;
      case 'image': return <Image className="h-4 w-4 text-pink-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-purple-400" />;
      default: return <Zap className="h-4 w-4 text-cyan-400" />;
    }
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
          aria-label="AI Provider status"
        >
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="cyber-glitch" data-text={currentProvider?.name || 'AI'}>{currentProvider?.name || 'AI Provider'}</span>
          </span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-pink-400 hover:bg-pink-400/10"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-purple-400 hover:bg-purple-400/10"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-cyan-400 hover:bg-cyan-400/10"
          aria-label="Knowledge Base"
        >
          <Database className="h-4 w-4" />
        </Button>
        
        <ChatPositionToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-yellow-400 hover:bg-yellow-400/10"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:bg-red-500/20 hover:text-red-400"
          onClick={closeChat}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <AIProviderStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        providers={availableProviders}
        currentProvider={currentProvider}
      />
    </div>
  );
}
