import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
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
  currentAPI?: string;
  dragHandleProps?: any;
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
  connectionState,
  currentAPI,
  dragHandleProps
}: ChatWindowProps) => {
  return (
    <Dialog open={!isMinimized} modal={false}>
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
        data-chat-window="true"
        data-minimized={isMinimized}
      >
        <div className="flex flex-col h-full">
          <ChatHeader
            onMinimize={onMinimize}
            onClose={onClose}
            isTacked={isTacked}
            onTackToggle={onTackToggle}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            currentAPI={currentAPI}
            connectionState={connectionState}
          />

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
    </Dialog>
  );
};