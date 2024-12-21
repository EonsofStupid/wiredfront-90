import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, Minus, GripVertical, Pin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from 'react';

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
  onLoadMore
}: ChatWindowProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-window',
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'fixed',
    left: isTacked ? 'auto' : position.x,
    right: isTacked ? '32px' : 'auto',
    bottom: isTacked ? '48px' : 'auto',
    top: isTacked ? 'auto' : position.y,
    width: dimensions.width,
    height: isMinimized ? '50px' : dimensions.height,
    transition: 'height 0.3s ease',
    zIndex: isDragging ? 9999 : 1000,
    border: isDragging ? `2px solid #baff0a` : undefined,
  } as const;

  // Handle infinite scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      onLoadMore();
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (lastMessageRef.current && !isLoadingMore) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isLoadingMore]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card flex flex-col"
    >
      <div
        className={`flex items-center justify-between p-2 border-b border-border ${!isTacked ? 'cursor-move' : ''}`}
        {...(!isTacked ? { ...attributes, ...listeners } : {})}
      >
        <GripVertical className={`h-4 w-4 text-foreground/60 ${isDragging ? 'text-[#baff0a]' : ''}`} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onTackToggle}
          >
            <Pin className={`h-4 w-4 ${isTacked ? 'text-neon-blue' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <ScrollArea 
          className="flex-1 p-4"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {isLoadingMore && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className="bg-muted/50 rounded-lg p-3"
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};