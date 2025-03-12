
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionItemProps {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const SessionItem = ({ id, lastAccessed, isActive, onSelect }: SessionItemProps) => {
  // Format session ID for display (first 8 chars)
  const displayId = id.slice(0, 8);
  
  // Format the date with date-fns
  const formattedDate = formatDistanceToNow(new Date(lastAccessed), { addSuffix: true });
  
  // Determine if session is recent (less than 1 hour old)
  const isRecent = new Date().getTime() - new Date(lastAccessed).getTime() < 60 * 60 * 1000;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 mb-1 transition-all duration-200 ${
              isActive ? "bg-white/10 text-white" : "hover:bg-white/5"
            }`}
            onClick={() => onSelect(id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="flex-1 text-left truncate">Session {displayId}</span>
            {isRecent && <span className="h-2 w-2 rounded-full bg-green-500" />}
            {isActive && <Check className="h-4 w-4" />}
            <Clock className="h-4 w-4 opacity-50" />
            <span className="text-xs opacity-70 truncate max-w-[80px]">
              {formattedDate}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          <div className="space-y-1">
            <p className="font-medium">Session ID: {id}</p>
            <p>Last accessed: {lastAccessed.toLocaleString()}</p>
            <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
