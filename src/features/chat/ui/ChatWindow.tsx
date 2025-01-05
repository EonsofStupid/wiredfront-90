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
    isDragging,
    setPosition,
    setDragging,
    toggleMinimize,
    resetPosition,
  } = useWindowStore();

  const cardRef = useRef<HTMLDivElement>(null);

  // Ensure chat window stays within viewport bounds
  useEffect(() => {
    const adjustPosition = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const margin = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;

      // Adjust position if window is outside viewport bounds
      if (newX + rect.width > viewportWidth - margin) {
        newX = viewportWidth - rect.width - margin;
      }
      if (newY + rect.height > viewportHeight - margin) {
        newY = viewportHeight - rect.height - margin;
      }
      if (newX < margin) newX = margin;
      if (newY < margin) newY = margin;

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
    setDragging(true);

    const handleDrag = (moveEvent: MouseEvent) => {
      const margin = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const windowWidth = cardRef.current?.offsetWidth || 0;
      const windowHeight = cardRef.current?.offsetHeight || 0;

      let newX = moveEvent.clientX - startX;
      let newY = moveEvent.clientY - startY;

      // Ensure window stays within viewport bounds with margin
      newX = Math.min(Math.max(margin, newX), viewportWidth - windowWidth - margin);
      newY = Math.min(Math.max(margin, newY), viewportHeight - windowHeight - margin);

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setDragging(false);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return (
    <Card
      ref={cardRef}
      className={`fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999] ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        transition: isDragging ? 'none' : 'height 0.2s ease-in-out',
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