
import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageProps {
  content: string;
  role: 'user' | 'assistant' | 'system';
  status?: 'pending' | 'sent' | 'failed';
  id?: string;
  timestamp?: string;
}

// Use memo to prevent unnecessary re-renders
const Message = memo(function Message({ 
  content, 
  role, 
  status = 'sent',
  id,
  timestamp 
}: MessageProps) {
  // Map role to appropriate CSS classes
  const messageClass = role === 'user' 
    ? 'chat-message-user' 
    : role === 'system' 
      ? 'chat-message-system' 
      : 'chat-message-assistant';
  
  // Map status to icon and tooltip text
  const statusConfig = {
    pending: { icon: <Clock className="h-3 w-3 animate-pulse" />, tooltip: 'Sending message...' },
    sent: { icon: <Check className="h-3 w-3" />, tooltip: 'Message sent' },
    failed: { icon: <AlertCircle className="h-3 w-3 text-destructive" />, tooltip: 'Failed to send' }
  };
  
  const { icon, tooltip } = statusConfig[status];

  // Add proper ARIA attributes for accessibility
  const messageType = role === 'user' ? 'Sent' : 'Received';
  const statusText = status === 'pending' ? 'Sending...' : 
                   status === 'sent' ? 'Sent' : 'Failed to send';

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
      role="listitem"
      aria-label={`${messageType} message: ${content}`}
      data-message-id={id}
      data-message-role={role}
      data-message-status={status}
    >
      <Card
        className={cn(
          "max-w-[80%] px-4 py-2 shadow-sm transition-all duration-200",
          messageClass,
          status === 'failed' && "border-destructive"
        )}
      >
        <div className="flex items-start gap-2">
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{content}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span 
                  className="ml-2 flex h-4 w-4 items-center justify-center self-end" 
                  aria-label={statusText}
                >
                  {icon}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs chat-dialog-content">
                <p>{tooltip}</p>
                {timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(timestamp).toLocaleTimeString()}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>
    </div>
  );
});

export { Message };
