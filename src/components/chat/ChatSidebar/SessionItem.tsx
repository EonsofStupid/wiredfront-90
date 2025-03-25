
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Check, Hash, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMessageStore } from "../messaging/MessageManager";

interface SessionItemProps {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
  messageCount?: number;
  title?: string;
  onSelect: (id: string) => void;
  provider?: string;
}

export const SessionItem = ({ 
  id, 
  lastAccessed, 
  isActive, 
  messageCount = 0,
  title,
  onSelect,
  provider
}: SessionItemProps) => {
  // Format the date with date-fns
  const formattedDate = formatDistanceToNow(lastAccessed, { addSuffix: true });
  
  // Determine if session is recent (less than 1 hour old)
  const isRecent = new Date().getTime() - lastAccessed.getTime() < 60 * 60 * 1000;

  // Get the first message for this session
  const messages = useMessageStore(state => state.messages);
  const sessionMessages = messages.filter(m => m.chat_session_id === id);
  const firstMessage = sessionMessages[0]?.content || title || 'New Chat';

  // Truncate the first message for display
  const truncatedMessage = firstMessage.length > 50 
    ? firstMessage.substring(0, 50) + '...' 
    : firstMessage;

  // Check if session is getting long (more than 20 messages)
  const isLongSession = messageCount > 20;

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
            <div className="flex-1 text-left truncate flex flex-col">
              <span className="truncate">{truncatedMessage}</span>
              {provider && (
                <span className="text-xs opacity-70 truncate">
                  {provider}
                </span>
              )}
            </div>
            {messageCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                <Hash className="h-3 w-3 mr-0.5" />
                {messageCount}
              </span>
            )}
            {isRecent && <span className="h-2 w-2 rounded-full bg-green-500" />}
            {isActive && <Check className="h-4 w-4 text-chat-knowledge-text" />}
            {isLongSession && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This session is getting long. Consider starting a new chat for better performance.</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Clock className="h-4 w-4 opacity-50" />
            <span className="text-xs opacity-70 truncate max-w-[80px]">
              {formattedDate}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="text-xs chat-dialog-content max-w-[300px]"
        >
          <div className="space-y-1">
            <p className="font-medium">First Message:</p>
            <p className="opacity-90">{firstMessage}</p>
            <p>Last accessed: {lastAccessed.toLocaleString()}</p>
            <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
            {messageCount > 0 && <p>Messages: {messageCount}</p>}
            {provider && <p>Provider: {provider}</p>}
            {isLongSession && (
              <p className="text-yellow-500">
                ⚠️ This session is getting long. Consider starting a new chat for better performance.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
