import { cn } from "@/lib/utils";
import { ChatMessageProps } from "./types";

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "glass-card max-w-[80%] p-4 text-sm",
          isCurrentUser ? "bg-neon-blue/10" : "bg-neon-pink/10"
        )}
      >
        <p className="break-words">{message.content}</p>
        <span className="mt-1 block text-xs text-foreground/60">
          {new Date(message.created_at || "").toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};