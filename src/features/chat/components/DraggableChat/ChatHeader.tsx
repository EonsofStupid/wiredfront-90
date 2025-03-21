import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useChatCombined } from '@/stores/features/chat';
import { BookOpen, Code, Database, Image, Maximize2, Minimize2, Pin, PinOff, Sidebar, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface ChatHeaderProps {
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
  const {
    currentMode,
    isMinimized,
    docked,
    toggleMinimize,
    toggleOpen,
    toggleDocked,
    toggleSidebar
  } = useChatCombined();

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
    <div className={cn("chat-header h-12 px-3 flex items-center justify-between cyber-bg cyber-border", className)}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 hover:text-cyan-400 hover:bg-cyan-400/10"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          data-testid="sidebar-toggle"
        >
          <Sidebar className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-8 text-xs chat-control-button cyber-pulse"
          onClick={() => setStatusDialogOpen(true)}
          aria-label="Select AI mode"
        >
          <span className="flex items-center gap-1">
            {getModeIcon()}
            <span className="capitalize">{currentMode}</span>
          </span>
        </Button>

        <span className="ml-2 text-xs text-white/40">|</span>

        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-8 text-xs chat-control-button"
              aria-label="AI Provider Status"
            >
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3 text-green-400" />
                <span>Default</span>
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">AI Provider Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Provider</span>
                <span className="text-white">Default</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Status</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Mode</span>
                <span className="text-white capitalize">{currentMode}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-1">
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
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 text-red-400 hover:bg-red-400/10"
          onClick={toggleOpen}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
