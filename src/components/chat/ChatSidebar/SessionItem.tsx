
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Check, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionItemProps {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
  messageCount?: number;
  title?: string;
  onSelect: (id: string) => void;
}

export const SessionItem = ({ 
  id, 
  lastAccessed, 
  isActive, 
  messageCount = 0,
  title,
  onSelect 
}: SessionItemProps) => {
  // Format session ID for display (first 8 chars)
  const displayId = id.slice(0, 8);
  
  // Format the date with date-fns
  const formattedDate = formatDistanceToNow(lastAccessed, { addSuffix: true });
  
  // Determine if session is recent (less than 1 hour old)
  const isRecent = new Date().getTime() - lastAccessed.getTime() < 60 * 60 * 1000;

  // Display title or default to session ID
  const displayTitle = title || `Session ${displayId}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 mb-1 transition-all duration-200 ${
              isActive 
                ? "bg-chat-message-assistant-bg/50 text-chat-knowledge-text chat-cyber-border" 
                : "hover:bg-chat-message-assistant-bg/20"
            }`}
            onClick={() => onSelect(id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="flex-1 text-left truncate">{displayTitle}</span>
            {messageCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                <Hash className="h-3 w-3 mr-0.5" />
                {messageCount}
              </span>
            )}
            {isRecent && <span className="h-2 w-2 rounded-full bg-green-500" />}
            {isActive && <Check className="h-4 w-4 text-chat-knowledge-text" />}
            <Clock className="h-4 w-4 opacity-50" />
            <span className="text-xs opacity-70 truncate max-w-[80px]">
              {formattedDate}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="text-xs chat-dialog-content"
        >
          <div className="space-y-1">
            <p className="font-medium">Session ID: {id}</p>
            <p>Last accessed: {lastAccessed.toLocaleString()}</p>
            <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
            {messageCount > 0 && <p>Messages: {messageCount}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
