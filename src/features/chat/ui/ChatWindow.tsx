import React from 'react';
import { Card } from '@/components/ui/card';
import { useWindowStore } from '../core/window/WindowManager';
import { Button } from '@/components/ui/button';
import { Minus, Maximize2, X } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow: React.FC = () => {
  const {
    position,
    size,
    isMinimized,
    setPosition,
    toggleMinimize,
    resetPosition,
  } = useWindowStore();

  const handleDragStart = (e: React.DragEvent) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleDrag = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return (
    <Card
      className="fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999]"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        transition: 'height 0.2s ease-in-out',
      }}
    >
      <div
        className="p-2 cursor-move bg-muted flex items-center justify-between"
        onMouseDown={(e: React.MouseEvent) => handleDragStart(e as any)}
      >
        <span className="text-sm font-medium">AI Assistant</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={resetPosition}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              // Close functionality will be implemented with window state management
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessageList />
          <ChatInput />
        </div>
      )}
    </Card>
  );
};