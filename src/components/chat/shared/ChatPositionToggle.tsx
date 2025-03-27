
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useChatStore } from "../store/chatStore";

export function ChatPositionToggle() {
  const { position, togglePosition } = useChatStore();

  const handlePositionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePosition();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
            onClick={handlePositionToggle}
            data-testid="toggle-position-button"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p className="text-xs">Toggle between left/right positions</p>
          <p className="text-xs text-muted-foreground">Current: {position}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
