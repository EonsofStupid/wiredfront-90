
import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { GitHubInfoDialog } from './GitHubInfoDialog';
import { logger } from '@/services/chat/LoggingService';

export function GitHubInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    logger.info('GitHub info dialog state changed', { open });
  };

  const getPreviewContent = () => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <GitBranchIcon className="h-3.5 w-3.5" />
          GitHub Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last commit</span>
            <span className="text-xs font-medium">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-xs">Synced</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-background/10"
              aria-label="GitHub integration status"
            >
              <GitBranchIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-64 p-3 chat-dialog-content"
          side="top"
          align="end"
        >
          {getPreviewContent()}
        </HoverCardContent>
      </Dialog>
      {isOpen && <GitHubInfoDialog />}
    </Dialog>
  );
}

export default GitHubInfoButton;
