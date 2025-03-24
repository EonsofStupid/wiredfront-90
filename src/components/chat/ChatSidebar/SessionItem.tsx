import React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionModeBadge } from "./SessionModeBadge";
import { ChatMode } from "@/integrations/supabase/types/enums";

interface SessionItemProps {
  id: string;
  title?: string;
  lastAccessed: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  provider?: string;
  messageCount?: number;
  mode?: ChatMode;
}

export const SessionItem = ({ 
  id, 
  title = "New Chat", 
  lastAccessed, 
  isActive, 
  onSelect,
  provider,
  messageCount = 0,
  mode = "chat"
}: SessionItemProps) => {
  const timeAgo = formatDistanceToNow(lastAccessed, { addSuffix: true });
  
  const handleClick = () => {
    onSelect(id);
  };
  
  return (
    <div
      className={`rounded-md p-2 cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-primary/10 text-primary-foreground"
          : "hover:bg-muted/50 text-foreground/80"
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium truncate text-sm">
              {title}
            </h3>
            {mode && <SessionModeBadge mode={mode} />}
          </div>
          
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <span className="truncate">{timeAgo}</span>
            {messageCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-muted/50 rounded-full text-[10px]">
                {messageCount} msg{messageCount !== 1 ? 's' : ''}
              </span>
            )}
            {provider && (
              <span className="ml-2 opacity-70 truncate">{provider}</span>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement session actions menu
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Session actions</span>
        </Button>
      </div>
    </div>
  );
};
