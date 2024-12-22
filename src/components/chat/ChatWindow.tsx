import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minimize2, X, Tack, TackOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ConnectionStatus } from "./ConnectionStatus";

interface ChatWindowProps {
  position: { x: number; y: number };
  isMinimized: boolean;
  messages: any[];
  isLoading: boolean;
  onMinimize: () => void;
  onClose: () => void;
  isDragging: boolean;
  isTacked: boolean;
  onTackToggle: () => void;
  dimensions: { width: number; height: number };
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onSendMessage: (content: string) => Promise<void>;
  connectionState: string;
}

export const ChatWindow = ({ 
  position,
  isMinimized,
  messages,
  isLoading,
  onMinimize,
  onClose,
  isDragging,
  isTacked,
  onTackToggle,
  dimensions,
  hasMoreMessages,
  isLoadingMore,
  onLoadMore,
  onSendMessage,
  connectionState
}: ChatWindowProps) => {
  return (
    <DialogContent 
      className={cn(
        "glass-card fixed p-0 border-none shadow-2xl transition-transform duration-200",
        isDragging && "opacity-50",
        isMinimized && "scale-0"
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : undefined
      }}
    >
      <DialogHeader>
        <DialogTitle className="sr-only">Chat Window</DialogTitle>
        <DialogDescription className="sr-only">
          Chat interface for communicating with the AI assistant
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <ConnectionStatus state={connectionState} />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onTackToggle}
            >
              {isTacked ? (
                <TackOff className="h-4 w-4" />
              ) : (
                <Tack className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onMinimize}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            hasMore={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
          />
        </div>

        <div className="p-4 border-t border-border/50">
          <MessageInput onSend={onSendMessage} />
        </div>
      </div>
    </DialogContent>
  );
};