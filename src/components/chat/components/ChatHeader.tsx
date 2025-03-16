
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, X, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPositionToggle } from "./ChatPositionToggle";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ChatHeaderTopNav } from "../features/ChatHeaderTopNav";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatModeDialog } from "../features/ModeSwitch";

interface ChatHeaderProps {
  title: string;
  showSidebar: boolean;
  isMinimized: boolean;
  onToggleSidebar: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export function ChatHeader({
  title,
  showSidebar,
  isMinimized,
  onToggleSidebar,
  onMinimize,
  onClose,
}: ChatHeaderProps) {
  const { docked, toggleDocked, messages, startTime } = useChatStore();
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const isGalleryPage = location.pathname === '/gallery';
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  
  // Calculate session stats
  const messageCount = messages?.length || 0;
  const sessionDuration = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0; // in minutes
  const aiResponses = messages?.filter(m => m.role === 'assistant').length || 0;

  // Get display mode label
  const getModeLabel = () => {
    if (isEditorPage) return "DEV";
    if (isGalleryPage) return "IMAGE";
    return title;
  };

  // Prevent propagation to avoid triggering drag when clicking buttons
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <motion.div 
      className="chat-header"
      style={{ position: 'relative', zIndex: 'var(--z-chat)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <ChatHeaderTopNav />
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={(e) => handleButtonClick(e, onToggleSidebar)}
          title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          data-testid="toggle-sidebar-button"
        >
          {showSidebar ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <button 
              onClick={() => setModeDialogOpen(true)}
              className="chat-neon-glow font-mono text-sm md:text-base bg-gradient-to-r chat-cyber-border
                font-bold hover:scale-105 transition-transform duration-200 cursor-pointer
                px-2 py-1 rounded"
            >
              {getModeLabel()}
            </button>
          </HoverCardTrigger>
          <HoverCardContent 
            className="chat-glass-card chat-cyber-border w-64 text-chat-knowledge-text">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Session Stats</h4>
              <div className="text-xs space-y-1.5">
                <p>Messages: {messageCount}</p>
                <p>AI Responses: {aiResponses}</p>
                <p>Duration: {sessionDuration} min</p>
                <p className="italic text-xs mt-1 opacity-70">Click for more options</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <ChatModeDialog 
          open={modeDialogOpen} 
          onOpenChange={setModeDialogOpen} 
        />
      </div>

      <div className="chat-controls flex gap-1">
        <ChatPositionToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={(e) => handleButtonClick(e, toggleDocked)}
          title={docked ? "Undock chat" : "Dock chat"}
          data-testid="toggle-dock-button"
        >
          {docked ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={(e) => handleButtonClick(e, onMinimize)}
          title={isMinimized ? "Maximize chat" : "Minimize chat"}
          data-testid="minimize-button"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8" 
          onClick={(e) => handleButtonClick(e, onClose)}
          title="Close chat"
          data-testid="close-button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
