import React from 'react';
import { Card } from '@/components/ui/card';
import { useWindowStore } from '../core/window/WindowManager';
import { Button } from '@/components/ui/button';
import { Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow: React.FC = () => {
  const { position, isMinimized, toggleMinimize, setPosition } = useWindowStore();

  const handlePositionToggle = () => {
    setPosition(position === 'bottom-right' ? 'bottom-left' : 'bottom-right');
  };

  return (
    <Card
      className={`fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999] transition-all duration-300 ${
        position === 'bottom-right' ? 'right-4' : 'left-4'
      } bottom-20 w-[380px] ${
        isMinimized ? 'h-auto' : 'h-[500px]'
      }`}
    >
      <div className="p-2 bg-muted flex items-center justify-between select-none">
        <span className="text-sm font-medium">AI Assistant</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handlePositionToggle}
          >
            {position === 'bottom-right' ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleMinimize}
          >
            <Minus className="h-4 w-4" />
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