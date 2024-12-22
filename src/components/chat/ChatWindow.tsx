import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minimize2, X, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ConnectionStatus } from "./ConnectionStatus";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ConnectionState } from "@/types/websocket";

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
  connectionState: ConnectionState;
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
      <DialogHeader className="sr-only">
        <DialogTitle>Chat Window</DialogTitle>
        <DialogDescription>
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
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
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
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            onScroll={() => {}}
          />
        </div>

        <div className="p-4 border-t border-border/50">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
    </DialogContent>
  );
};