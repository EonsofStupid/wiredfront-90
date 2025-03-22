
import React, { useState, useEffect, useCallback } from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BellIcon, 
  CheckIcon, 
  XIcon, 
  CheckCircleIcon, 
  AlertTriangle,
  Clock,
  Info,
  LucideIcon,
  ClipboardCheck
} from "lucide-react";
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const notificationIcons: Record<Notification['type'], LucideIcon> = {
  info: Info,
  success: CheckCircleIcon,
  warning: AlertTriangle,
  error: AlertTriangle
};

const notificationColors: Record<Notification['type'], string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-amber-400',
  error: 'text-red-400'
};

export function NotificationsDialog() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      logger.info('Fetching notifications');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock data
      setNotifications([
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
        },
        {
          id: '3',
          message: 'API rate limit approaching threshold',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true,
          type: 'warning'
        },
        {
          id: '4',
          message: 'Failed to validate GitHub token',
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          read: true,
          type: 'error'
        }
      ]);
      
      logger.info('Notifications fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch notifications', { error });
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
  const displayedNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes === 0 ? 'Just now' : `${minutes}m ago`}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-chat-knowledge-text">
            <BellIcon className="h-5 w-5" />
            Notifications
          </div>
          <Badge variant="outline" className={`text-xs ${unreadCount > 0 ? 'bg-red-500/10 text-red-400' : ''}`}>
            {unreadCount} Unread
          </Badge>
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs">
          Stay updated on system events and important alerts
        </DialogDescription>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="mt-2">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="all" className="text-xs">All Notifications</TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">
            Unread
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-400 h-5 w-5 p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-2">
          {renderNotificationList(displayedNotifications, isLoading)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-2">
          {renderNotificationList(displayedNotifications, isLoading)}
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || isLoading}
          className="text-chat-knowledge-text border-chat-knowledge-border"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={dismissAll}
          disabled={notifications.length === 0 || isLoading}
          className="text-white bg-gradient-to-r from-[#1EAEDB] to-[#0080B3] border-none hover:opacity-90"
        >
          <XIcon className="h-4 w-4 mr-2" />
          Clear All
          {notifications.length > 0 && (
            <Badge variant="outline" className="ml-2 bg-white/10 text-white h-5 w-5 p-0 flex items-center justify-center">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  function renderNotificationList(notifications: Notification[], isLoading: boolean) {
    if (isLoading) {
      return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start justify-between p-3 rounded-md bg-chat-message-system-bg/30">
              <div className="space-y-1 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-8 text-white/60">
          <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="mb-1">No notifications</p>
          <p className="text-xs text-muted-foreground">You're all caught up!</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[300px] overflow-y-auto chat-messages-container pr-2">
        {notifications.map((notification) => {
          const NotificationIcon = notificationIcons[notification.type];
          const colorClass = notificationColors[notification.type];
          
          return (
            <div 
              key={notification.id} 
              className={`flex items-start justify-between p-3 rounded-md ${
                notification.read ? 'bg-chat-message-system-bg/30' : 'bg-chat-message-assistant-bg/30'
              } hover:bg-chat-message-assistant-bg/40 transition-colors duration-200`}
              role="listitem"
              aria-label={notification.read ? 'Read notification' : 'Unread notification'}
            >
              <div className="flex gap-2">
                <div className={`mt-0.5 ${colorClass}`}>
                  <NotificationIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`${notification.read ? 'font-normal' : 'font-medium'} text-sm`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <Badge variant="outline" className="text-[10px] h-4 bg-red-500/10 text-red-400">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="text-primary hover:text-primary/80 p-1 rounded-sm hover:bg-white/5 transition-colors"
                    aria-label="Mark as read"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </button>
                )}
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  className="text-muted-foreground hover:text-destructive p-1 rounded-sm hover:bg-white/5 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
