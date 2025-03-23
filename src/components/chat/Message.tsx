import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Check, Clock } from "lucide-react";
import { memo, useCallback } from "react";
import type { MessageProps } from "./types";

// Use memo to prevent unnecessary re-renders
export const Message = memo(function Message({
  content,
  role,
  status = "sent",
  id,
  timestamp,
  onRetry,
}: MessageProps) {
  // Map role to appropriate CSS classes
  const messageClass =
    role === "user"
      ? "bg-[var(--chat-message-user-bg)] text-[var(--chat-message-user-text)]"
      : role === "system"
      ? "bg-[var(--chat-message-system-bg)] text-[var(--chat-message-system-text)]"
      : "bg-[var(--chat-message-assistant-bg)] text-[var(--chat-message-assistant-text)]";

  // Map status to icon and tooltip text
  const statusConfig = {
    pending: {
      icon: (
        <Clock className="h-3 w-3 animate-pulse text-[var(--chat-message-system-text)]" />
      ),
      tooltip: "Sending message...",
    },
    sent: {
      icon: (
        <Check className="h-3 w-3 text-[var(--chat-message-system-text)]" />
      ),
      tooltip: "Message sent",
    },
    failed: {
      icon: (
        <AlertCircle className="h-3 w-3 text-[var(--chat-notification-error)]" />
      ),
      tooltip: "Failed to send",
    },
  };

  const { icon, tooltip } = statusConfig[status];

  // Add proper ARIA attributes for accessibility
  const messageType = role === "user" ? "Sent" : "Received";
  const statusText =
    status === "pending"
      ? "Sending..."
      : status === "sent"
      ? "Sent"
      : "Failed to send";

  // Handle retry click with memoization to prevent rerenders
  const handleRetryClick = useCallback(() => {
    if (status === "failed" && id && onRetry) {
      onRetry(id);
    }
  }, [id, status, onRetry]);

  return (
    <div
      className={`flex w-full mb-4 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
      aria-label={`${
        role === "user" ? "Sent" : "Received"
      } message: ${content}`}
      data-message-id={id}
      data-message-role={role}
      data-message-status={status}
    >
      <Card
        className={`max-w-[80%] px-4 py-2 shadow-[var(--chat-box-shadow)] ${messageClass} ${
          status === "failed"
            ? "border-[var(--chat-notification-error)] hover:border-[var(--chat-notification-error)]/70 cursor-pointer"
            : ""
        }`}
        onClick={status === "failed" ? handleRetryClick : undefined}
        tabIndex={status === "failed" ? 0 : undefined}
        role={status === "failed" ? "button" : undefined}
        aria-label={status === "failed" ? "Retry sending message" : undefined}
        onKeyDown={
          status === "failed"
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleRetryClick();
                }
              }
            : undefined
        }
      >
        <div className="flex items-start gap-2">
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {content}
          </p>
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
              <TooltipContent
                side="top"
                className="text-xs bg-[var(--chat-dialog-bg)] border-[var(--chat-dialog-border)] text-[var(--chat-dialog-text)]"
              >
                <p>{tooltip}</p>
                {timestamp && (
                  <p className="text-xs text-[var(--chat-message-system-text)] mt-1">
                    {new Date(timestamp).toLocaleTimeString()}
                  </p>
                )}
                {status === "failed" && (
                  <p className="text-xs text-[var(--chat-notification-error)] mt-1">
                    Click to retry
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
