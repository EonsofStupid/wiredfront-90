import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, Minus, GripVertical, Pin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  position: { x: number; y: number };
  isMinimized: boolean;
  messages: any[];
  onMinimize: () => void;
  onClose: () => void;
  isDragging: boolean;
  isTacked: boolean;
  onTackToggle: () => void;
  dimensions: { width: number; height: number };
}

export const ChatWindow = ({ 
  position, 
  isMinimized, 
  messages, 
  onMinimize, 
  onClose,
  isDragging,
  isTacked,
  onTackToggle,
  dimensions
}: ChatWindowProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-window',
  });

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
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};