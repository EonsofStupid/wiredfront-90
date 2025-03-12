
import React, { useState } from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BellIcon, CheckIcon, XIcon, CheckCircleIcon } from "lucide-react";
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function NotificationsStatusDialog() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'New commit pushed to repository',
      timestamp: new Date(),
      read: false,
      type: 'info'
    },
    {
      id: '2',
      message: 'Code generation completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'success'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    logger.info('Notification marked as read', { id });
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    logger.info('Notification dismissed', { id });
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
    logger.info('All notifications marked as read');
  };
  
  const dismissAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
    logger.info('All notifications cleared');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-chat-knowledge-text">
            <BellIcon className="h-5 w-5" />
            Notifications
          </div>
          <Badge variant="outline" className="text-xs">
            {unreadCount} Unread
          </Badge>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto chat-messages-container pr-2">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start justify-between p-3 rounded-md ${
                  notification.read ? 'bg-chat-message-system-bg/30' : 'bg-chat-message-assistant-bg/30'
                }`}
              >
                <div>
                  <p className={`${notification.read ? 'font-normal' : 'font-medium'} text-sm`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-primary hover:text-primary/80 p-1"
                      aria-label="Mark as read"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                    aria-label="Dismiss notification"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="text-chat-knowledge-text border-chat-knowledge-border"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={dismissAll}
          disabled={notifications.length === 0}
          className="text-muted-foreground border-chat-knowledge-border"
        >
          <XIcon className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
