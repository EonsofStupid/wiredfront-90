
import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BellIcon } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { NotificationsDialog } from './NotificationsDialog';
import { logger } from '@/services/chat/LoggingService';

export function NotificationsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = 2; // This would be fetched from a notification service in a real app

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    logger.info('Notifications dialog state changed', { open });
  };

  const getPreviewContent = () => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <BellIcon className="h-3.5 w-3.5" />
          Notifications
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unread</span>
            <span className="text-xs font-medium">{unreadCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last update</span>
            <span className="text-xs">Just now</span>
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
              className="text-chat-notification-text border-chat-notification-border hover:bg-chat-notification-background/10 relative"
              aria-label="Notifications"
            >
              <BellIcon className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
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
      {isOpen && <NotificationsDialog />}
    </Dialog>
  );
}

export default NotificationsButton;
