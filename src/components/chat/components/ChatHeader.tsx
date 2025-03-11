
import React from "react";
import { ChevronLeft, ChevronRight, Minus, X, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPositionToggle } from "./ChatPositionToggle";
import { useChatStore } from "../store/chatStore";

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

  // Prevent propagation to avoid triggering drag when clicking buttons
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className="p-4 flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10"
          onClick={(e) => handleButtonClick(e, onToggleSidebar)}
        >
          {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex gap-2">
        <ChatPositionToggle />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10"
          onClick={(e) => handleButtonClick(e, toggleDocked)}
          title={docked ? "Undock chat" : "Dock chat"}
        >
          {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10"
          onClick={(e) => handleButtonClick(e, onMinimize)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/10"
          onClick={(e) => handleButtonClick(e, onClose)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
