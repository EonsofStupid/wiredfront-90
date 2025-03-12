
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface SessionHeaderProps {
  sessionCount: number;
}

export const SessionHeader = ({ sessionCount }: SessionHeaderProps) => {
  return (
    <div className="p-4 border-b border-white/10 bg-chat-header-bg flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-chat-knowledge-text" />
        <h2 className="font-semibold text-chat-text">Chat Sessions</h2>
      </div>
      <Badge 
        variant="outline" 
        className="text-xs text-chat-knowledge-text border-chat-knowledge-border"
      >
        {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
      </Badge>
    </div>
  );
};
