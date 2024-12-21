import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, Minus, GripVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  position: { x: number; y: number };
  isMinimized: boolean;
  messages: any[];
  onMinimize: () => void;
  onClose: () => void;
}

export const ChatWindow = ({ position, isMinimized, messages, onMinimize, onClose }: ChatWindowProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-window',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'fixed',
    left: position.x,
    top: position.y,
    width: '350px',
    height: isMinimized ? '50px' : '500px',
    transition: 'height 0.3s ease',
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card flex flex-col"
    >
      <div
        className="flex items-center justify-between p-2 border-b border-border cursor-move"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-foreground/60" />
        <div className="flex items-center gap-2">
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