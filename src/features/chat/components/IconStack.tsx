
import React from 'react';
import { Mic, Image, Search, Lightbulb, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconStackProps {
  position?: 'left' | 'right';
  className?: string;
}

export function IconStack({ position = 'right', className }: IconStackProps) {
  return (
    <div 
      className={cn(
        "chat-icon-stack",
        position === 'left' ? 'left' : 'right',
        className
      )}
    >
      <button
        type="button"
        className="chat-icon-button"
        aria-label="Voice commands"
      >
        <Mic size={18} />
      </button>
      
      <button
        type="button"
        className="chat-icon-button"
        aria-label="Image generation"
      >
        <Image size={18} />
      </button>
      
      <button
        type="button"
        className="chat-icon-button"
        aria-label="Search"
      >
        <Search size={18} />
      </button>
      
      <button
        type="button"
        className="chat-icon-button"
        aria-label="Memory"
      >
        <Lightbulb size={18} />
      </button>
      
      <button
        type="button"
        className="chat-icon-button"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
