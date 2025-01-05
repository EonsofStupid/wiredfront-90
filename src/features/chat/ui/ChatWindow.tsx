import React from 'react';
import { Card } from '@/components/ui/card';
import { useWindowStore } from '../core/window/WindowManager';
import { Button } from '@/components/ui/button';
import { Minus, ArrowLeft, ArrowRight, Edit2, Bot, FileText } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export const ChatWindow: React.FC = () => {
  const { position, isMinimized, toggleMinimize, setPosition } = useWindowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState('WFAI');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handlePositionToggle = () => {
    setPosition(position === 'bottom-right' ? 'bottom-left' : 'bottom-right');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Chat name updated');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setShowSidebar(!showSidebar);
    toast.success(isExpanded ? 'Chat window restored' : 'Chat window expanded');
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
      } bottom-20 ${
        isExpanded ? 'w-[460px]' : 'w-[380px]'
      } ${
        isMinimized ? 'h-auto' : 'h-[500px]'
      } transition-all duration-300 ease-in-out`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="p-2 bg-muted flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-background/20"
            onClick={() => toast.info('AI Provider Settings')}
          >
            <Bot className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-background/20"
            onClick={handleExpand}
          >
            <FileText className="h-4 w-4" />
          </Button>
          {renderTitle()}
        </div>
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
        <div className="flex-1 flex overflow-hidden">
          {showSidebar && (
            <div className="w-[120px] border-r border-border bg-muted/50 p-2">
              <div className="text-xs font-medium mb-2">Chat Sessions</div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">No active sessions</div>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatMessageList />
            <ChatInput />
          </div>
        </div>
      )}
    </Card>
  );
};