import React from 'react';
import { Card } from '@/components/ui/card';
import { useWindowStore } from '../core/window/WindowManager';
import { Button } from '@/components/ui/button';
import { Minus, ArrowLeft, ArrowRight, Edit2, Bot, FileText, Code } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChat } from '../ChatProvider';

export const ChatWindow: React.FC = () => {
  const { position, isMinimized, toggleMinimize, setPosition } = useWindowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState('WFAI');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isDevelopmentMode } = useChat();

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
        <span className="text-sm font-medium flex items-center gap-2">
          {isDevelopmentMode && <Code className="h-4 w-4 text-blue-500" />}
          {chatName}
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
      <div className={`p-2 ${isDevelopmentMode ? 'bg-blue-50' : 'bg-muted'} flex items-center justify-between select-none`}>
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
              <div className="text-xs font-medium mb-2">Active Sessions</div>
              <div className="space-y-1">
                {/* Add session list here if needed */}
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