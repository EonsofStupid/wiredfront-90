
import React from "react";
import { ChevronLeft, ChevronRight, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="p-4 cursor-move flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSidebar}
        >
          {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMinimize}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
