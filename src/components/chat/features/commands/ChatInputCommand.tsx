
import React, { useState, useEffect } from 'react';
import { CommandIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputCommandProps {
  onSendMessage: (message: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInputCommand: React.FC<ChatInputCommandProps> = ({
  onSendMessage,
  onFocusChange,
  placeholder = 'Type a message or /command...',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isCommandMode, setIsCommandMode] = useState(false);
  
  // Check if input starts with / to enter command mode
  useEffect(() => {
    setIsCommandMode(inputValue.startsWith('/'));
  }, [inputValue]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleFocus = () => {
    onFocusChange?.(true);
  };
  
  const handleBlur = () => {
    onFocusChange?.(false);
  };
  
  return (
    <div className="flex items-center gap-2 w-full px-3 py-2 border-t border-border/50 cyber-bg">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`h-8 w-8 text-muted-foreground ${isCommandMode ? 'text-cyan-400' : ''}`}
        disabled={disabled}
        aria-label="Command"
      >
        <CommandIcon size={16} />
      </Button>
      
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={`flex-1 h-9 bg-background/50 focus:bg-background ${isCommandMode ? 'text-cyan-400' : ''}`}
      />
      
      <Button
        type="button"
        size="sm"
        onClick={handleSendMessage}
        disabled={!inputValue.trim() || disabled}
        className="h-9 px-3 bg-primary/80 hover:bg-primary"
      >
        Send
      </Button>
    </div>
  );
};
