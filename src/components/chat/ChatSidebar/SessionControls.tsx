
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
  sessionCount: number;
}

export const SessionControls = ({ 
  onNewSession, 
  onCleanupSessions, 
  sessionCount = 0 
}: SessionControlsProps) => {
  return (
    <div className="flex gap-2 p-4 border-t border-white/10">
      <Button
        variant="outline"
        className="flex-1 text-sm hover:bg-white/10 transition-all duration-200"
        onClick={onNewSession}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Session
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCleanupSessions}
              disabled={sessionCount === 0}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Clean up inactive sessions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
