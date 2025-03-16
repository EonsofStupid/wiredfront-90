
import React, { useState } from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BellIcon, Check, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/services/chat/LoggingService';

export function NotificationsDialog() {
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'New commits available', time: '2 minutes ago', read: false, type: 'system' },
    { id: '2', message: 'AI assistant updated', time: '1 hour ago', read: true, type: 'system' },
    { id: '3', message: 'Project build completed', time: '3 hours ago', read: false, type: 'project' }
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    logger.info('Marked all notifications as read');
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    logger.info('Cleared all notifications');
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    logger.info('Marked notification as read', { id });
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    logger.info('Deleted notification', { id });
  };

  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-chat-notification-text">
          <BellIcon className="h-5 w-5" />
          Notifications
        </DialogTitle>
        <DialogDescription>
          Stay updated with system and project notifications
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="all" className="mt-4">
        <TabsList className="bg-background/50 border border-chat-knowledge-border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-2 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border rounded-md flex items-start justify-between ${
                  notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'
                }`}
              >
                <div className="space-y-1">
                  <div className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="system" className="mt-2 space-y-2">
          {notifications.filter(n => n.type === 'system').length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No system notifications
            </div>
          ) : (
            notifications
              .filter(n => n.type === 'system')
              .map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-md flex items-start justify-between ${
                    notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'
                  }`}
                >
                  <div className="space-y-1">
                    <div className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </TabsContent>
        
        <TabsContent value="project" className="mt-2 space-y-2">
          {notifications.filter(n => n.type === 'project').length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No project notifications
            </div>
          ) : (
            notifications
              .filter(n => n.type === 'project')
              .map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-md flex items-start justify-between ${
                    notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'
                  }`}
                >
                  <div className="space-y-1">
                    <div className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-4 space-x-2">
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
        <Button variant="outline" className="border-destructive text-destructive" onClick={clearAllNotifications}>
          Clear All
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
