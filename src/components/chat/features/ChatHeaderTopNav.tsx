
import React, { useState } from 'react';
import { Code, Image, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '../providers/ChatModeProvider';

export function ChatHeaderTopNav() {
  const { features } = useChatStore();
  const { mode, setMode } = useChatMode();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  
  // Only show if mode switching is enabled
  if (!features.modeSwitch) return null;
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 mr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-1 rounded-full ${mode === 'standard' ? 'bg-primary/20' : 'opacity-50'}`}
              onClick={() => setMode('standard')}
              onMouseEnter={() => setHoveredIcon('chat')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Chat Mode</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-1 rounded-full ${mode === 'editor' ? 'bg-primary/20' : 'opacity-50'}`}
              onClick={() => setMode('editor')}
              onMouseEnter={() => setHoveredIcon('code')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Code Mode</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-1 rounded-full ${mode === 'image' ? 'bg-primary/20' : 'opacity-50'}`}
              onClick={() => setMode('image')}
              onMouseEnter={() => setHoveredIcon('image')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Image className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Image Mode</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
