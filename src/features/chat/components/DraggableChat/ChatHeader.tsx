
import React, { useState } from 'react';
import { X, Minimize2, Maximize2, Sidebar, Settings, Database, Code, Image, BookOpen, Zap, Pin, PinOff } from 'lucide-react';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
  const { toggleMinimize, toggleOpen, toggleSidebar, isMinimized, docked, toggleDocked } = useChatLayoutStore();
  const { currentMode, setMode } = useChatModeStore();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  // Convert mode to display title
  const getDisplayTitle = () => {
    switch (currentMode) {
      case 'dev': return 'Developer Assistant';
      case 'image': return 'Image Generator';
      case 'training': return 'Training Mode';
      case 'code': return 'Code Assistant';
      case 'planning': return 'Project Planning';
      default: return 'AI Assistant';
    }
  };
  
  // Get icon for current mode
  const getModeIcon = () => {
    switch (currentMode) {
      case 'dev': return <Code className="h-4 w-4 text-cyan-400" />;
      case 'image': return <Image className="h-4 w-4 text-pink-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-purple-400" />;
      default: return <Zap className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className={cn("chat-header h-12 px-3 flex items-center justify-between", className)}>
      <div className="flex items-center">
        <button 
          className="chat-header-button h-8 w-8 hover:text-cyan-400 hover:bg-cyan-400/10 bg-transparent rounded-md flex items-center justify-center"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Sidebar size={18} />
        </button>
        
        <button
          className="ml-2 h-8 text-xs chat-header-button cyber-pulse bg-transparent border-none flex items-center justify-center p-2"
          onClick={() => setStatusDialogOpen(true)}
          aria-label="Select AI mode"
        >
          <span className="flex items-center gap-1">
            {getModeIcon()}
            <span className="capitalize">{currentMode}</span>
          </span>
        </button>
        
        <span className="ml-2 text-xs text-white/40">|</span>
        
        <button
          className="ml-2 h-8 text-xs chat-header-button bg-transparent border-none flex items-center justify-center p-2"
          onClick={() => setStatusDialogOpen(true)}
          aria-label="AI Provider Status"
        >
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3 text-green-400" />
            <span>Default</span>
          </span>
        </button>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          className="chat-header-button h-8 w-8 bg-transparent border-none flex items-center justify-center"
          onClick={toggleDocked}
          aria-label={docked ? "Undock chat" : "Dock chat"}
        >
          {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
        
        <button 
          className="chat-header-button h-8 w-8 bg-transparent border-none flex items-center justify-center"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
        </button>
        
        <button 
          className="chat-header-button h-8 w-8 text-red-400 hover:bg-red-400/10 bg-transparent border-none flex items-center justify-center"
          onClick={toggleOpen}
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
