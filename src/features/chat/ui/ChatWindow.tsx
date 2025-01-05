import React, { useEffect, useRef } from 'react';
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

  const cardRef = useRef<HTMLDivElement>(null);

  // Ensure chat window is within viewport bounds on mount and window resize
  useEffect(() => {
    const adjustPosition = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;

      // Adjust X position if window is too far right
      if (newX + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 20; // 20px margin
      }

      // Adjust Y position if window is too far down
      if (newY + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 20; // 20px margin
      }

      // Ensure window isn't positioned off-screen to the left or top
      if (newX < 0) newX = 20;
      if (newY < 0) newY = 20;

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    };

    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, [position, setPosition]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleDrag = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - startX;
      const newY = moveEvent.clientY - startY;

      // Ensure the window stays within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const windowWidth = cardRef.current?.offsetWidth || 0;
      const windowHeight = cardRef.current?.offsetHeight || 0;

      const boundedX = Math.min(Math.max(0, newX), viewportWidth - windowWidth);
      const boundedY = Math.min(Math.max(0, newY), viewportHeight - windowHeight);

      setPosition({ x: boundedX, y: boundedY });
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
      ref={cardRef}
      className="fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999]"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        transition: 'height 0.2s ease-in-out',
      }}
    >
      <div
        className="p-2 cursor-move bg-muted flex items-center justify-between select-none"
        onMouseDown={handleDragStart}
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