
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Download, 
  Share, 
  Copy, 
  BrainCircuit 
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useChatStore } from '../store';

export const ChatIconStack: React.FC = () => {
  const { isMinimized, resetChatState } = useChatStore();

  // Don't show when minimized
  if (isMinimized) {
    return null;
  }

  return (
    <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 border border-white/10 hover:bg-neon-blue/20 hover:border-neon-blue/40 text-white"
            >
              <BrainCircuit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Show AI context</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 border border-white/10 hover:bg-white/20 hover:border-white/30 text-white"
              onClick={() => {
                navigator.clipboard.writeText('Chat content');
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Copy conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 border border-white/10 hover:bg-white/20 hover:border-white/30 text-white"
            >
              <Share className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Share conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 border border-white/10 hover:bg-white/20 hover:border-white/30 text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Save conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-white hover:text-red-400"
              onClick={() => {
                if (confirm('Clear all messages? This cannot be undone.')) {
                  resetChatState();
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Clear conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
