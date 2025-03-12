
import React from "react";
import { ChevronLeft, ChevronRight, Minus, X, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPositionToggle } from "./ChatPositionToggle";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { GitHubInfoButton } from "../features/githubinfo";
import { NotificationsButton } from "../features/notifications";
import { ChatHeaderTopNav } from "../features/ChatHeaderTopNav";

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
  const displayTitle = isEditorPage ? "Dev Mode" : title;

  // Prevent propagation to avoid triggering drag when clicking buttons
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <motion.div 
      className="p-4 flex flex-row justify-between items-center chat-header"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <ChatHeaderTopNav />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
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
        <span className="font-semibold text-sm md:text-base neon-glow">{displayTitle}</span>
      </div>
      <div className="flex gap-1">
        <GitHubInfoButton />
        <NotificationsButton />
        <ChatPositionToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
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
          className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
          onClick={(e) => handleButtonClick(e, onMinimize)}
          title={isMinimized ? "Maximize chat" : "Minimize chat"}
          data-testid="minimize-button"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
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
