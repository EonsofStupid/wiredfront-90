
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BotMessageSquare } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { AIProviderStatusDialog } from './AIProviderStatusDialog';
import { logger } from '@/services/chat/LoggingService';

export function AIProviderStatusButton() {
  const handleOpenSettings = () => {
    logger.info("AI Provider settings opened");
  };
  
  return (
    <Dialog>
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-chat-ai-text border-chat-ai-border hover:bg-chat-ai-background/10"
              onClick={handleOpenSettings}
              aria-label="AI Provider Settings"
            >
              <BotMessageSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-64 p-3 chat-dialog-content"
          side="top"
          align="end"
        >
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <BotMessageSquare className="h-3.5 w-3.5" />
              AI Provider Settings
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current provider</span>
                <span className="text-xs font-medium">OpenAI GPT-4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <AIProviderStatusDialog />
    </Dialog>
  );
}
