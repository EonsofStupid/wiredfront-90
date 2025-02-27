
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckIcon, XIcon } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function NotificationsModule() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
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
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <Card className="w-full my-2 border-dashed border-primary/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center">
            <BellIcon className="h-4 w-4 mr-2" />
            Notifications
          </h3>
          <Badge variant="outline" className="text-xs">
            {notifications.filter(n => !n.read).length} New
          </Badge>
        </div>
        
        <div className="space-y-2 mt-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No notifications</p>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start justify-between p-2 rounded-md text-xs ${
                  notification.read ? 'bg-background' : 'bg-primary/5'
                }`}
              >
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-muted-foreground mt-1">
                    {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <CheckIcon className="h-3 w-3" />
                    </button>
                  )}
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
