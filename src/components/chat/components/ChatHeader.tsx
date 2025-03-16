
import React from "react";
import { ChevronLeft, ChevronRight, Minus, X, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPositionToggle } from "./ChatPositionToggle";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { GitHubInfoButton } from "../features/githubinfo";
import { NotificationsButton } from "../features/notifications/NotificationsButton";
import { KnowledgeSourceButton } from "../features/knowledge-source/KnowledgeSourceButton";
import { StatusButton } from "../features/status-button";
import "../styles/index.css";

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
  const { docked, toggleDocked } = useChatStore();
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const isGalleryPage = location.pathname === '/gallery';
  
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
        
        <span className="chat-neon-glow font-mono text-sm md:text-base bg-gradient-to-r chat-cyber-border
          font-bold px-2 py-1 rounded">
          {getModeLabel()}
        </span>
      </div>

      <div className="chat-controls flex gap-1 items-center">
        {/* Status/feature buttons */}
        <StatusButton />
        
        {/* Position toggle */}
        <ChatPositionToggle />
        
        {/* Pin/dock button */}
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
        
        {/* Minimize button */}
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
        
        {/* Close button */}
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
