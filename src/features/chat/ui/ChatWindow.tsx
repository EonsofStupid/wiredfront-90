import React from 'react';
import { Card } from '@/components/ui/card';
import { useWindowStore } from '../core/window/WindowManager';
import { Button } from '@/components/ui/button';
import { Minus, ArrowLeft, ArrowRight, Edit2 } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export const ChatWindow: React.FC = () => {
  const { position, isMinimized, toggleMinimize, setPosition } = useWindowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState('WFAI');

  const handlePositionToggle = () => {
    setPosition(position === 'bottom-right' ? 'bottom-left' : 'bottom-right');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Chat name updated');
  };

  const renderTitle = () => {
    if (isEditing) {
      return (
        <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
          <Input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="h-6 w-32 text-sm"
            autoFocus
            onBlur={() => setIsEditing(false)}
          />
        </form>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {chatName.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block animate-gradient-x bg-gradient-to-r from-neon-blue via-neon-pink to-neon-violet bg-clip-text text-transparent"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <Card
      className={`fixed shadow-lg rounded-lg overflow-hidden bg-background flex flex-col z-[9999] ${
        position === 'bottom-right' ? 'right-4' : 'left-4'
      } bottom-20 w-[380px] ${
        isMinimized ? 'h-auto' : 'h-[500px]'
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="p-2 bg-muted flex items-center justify-between select-none">
        {renderTitle()}
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