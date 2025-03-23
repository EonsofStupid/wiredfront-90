import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger } from "@/services/chat/LoggingService";
import {
  AlertTriangle,
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  Clock,
  Info,
  LucideIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

const notificationIcons: Record<Notification["type"], LucideIcon> = {
  info: Info,
  success: CheckCircleIcon,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const notificationColors: Record<Notification["type"], string> = {
  info: "text-[var(--chat-notification-info)]",
  success: "text-[var(--chat-notification-success)]",
  warning: "text-[var(--chat-notification-warning)]",
  error: "text-[var(--chat-notification-error)]",
};

export function NotificationsStatusDialog() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      logger.info("Fetching notifications");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock data
      setNotifications([
        {
          id: "1",
          message: "New commit pushed to repository",
          timestamp: new Date(),
          read: false,
          type: "info",
        },
        {
          id: "2",
          message: "Code generation completed successfully",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          type: "success",
        },
        {
          id: "3",
          message: "API rate limit approaching threshold",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true,
          type: "warning",
        },
        {
          id: "4",
          message: "Failed to validate GitHub token",
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          read: true,
          type: "error",
        },
      ]);

      logger.info("Notifications fetched successfully");
    } catch (error) {
      logger.error("Failed to fetch notifications", { error });
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    logger.info("Notification marked as read", { id });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    logger.info("Notification dismissed", { id });
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
    logger.info("All notifications marked as read");
  };

  const dismissAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
    logger.info("All notifications cleared");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => !n.read);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60)
      return `${minutes === 0 ? "Just now" : `${minutes}m ago`}`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <DialogContent className="bg-[var(--chat-dialog-bg)] border-[var(--chat-dialog-border)] text-[var(--chat-dialog-text)] sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--chat-knowledge-text)]">
            <BellIcon className="h-5 w-5" />
            Notifications
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${
              unreadCount > 0
                ? "bg-[var(--chat-notification-background)] text-[var(--chat-notification-text)]"
                : ""
            }`}
          >
            {unreadCount} unread
          </Badge>
        </DialogTitle>
        <DialogDescription className="text-[var(--chat-message-system-text)] text-xs">
          Manage your notifications and preferences
        </DialogDescription>
      </DialogHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab as any}
        className="mt-2"
      >
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="all" className="text-xs">
            All Notifications
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">
            Unread
            {unreadCount > 0 && (
              <Badge
                variant="outline"
                className="ml-2 bg-[var(--chat-notification-background)] text-[var(--chat-notification-text)] h-5 w-5 p-0 flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-2">
          {renderNotificationList(notifications, isLoading)}
        </TabsContent>

        <TabsContent value="unread" className="mt-2">
          {renderNotificationList(displayedNotifications, isLoading)}
        </TabsContent>
      </Tabs>

      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || isLoading}
          className="text-[var(--chat-knowledge-text)] border-[var(--chat-knowledge-border)]"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>

        <Button
          variant="default"
          onClick={dismissAll}
          disabled={notifications.length === 0 || isLoading}
          className="text-white bg-gradient-to-r from-[var(--chat-knowledge-text)] to-[#0080B3] border-none hover:opacity-90"
        >
          <XIcon className="h-4 w-4 mr-2" />
          Clear all
          <Badge
            variant="outline"
            className="ml-2 bg-white/10 text-white h-5 w-5 p-0 flex items-center justify-center"
          >
            {notifications.length}
          </Badge>
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  function renderNotificationList(
    notifications: Notification[],
    isLoading: boolean
  ) {
    if (isLoading) {
      return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-between p-3 rounded-md bg-[var(--chat-notification-read-bg)]"
            >
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
        <div className="text-center py-8 text-[var(--chat-text)]/60">
          <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="mb-1">No notifications</p>
          <p className="text-xs text-[var(--chat-message-system-text)]">
            You're all caught up!
          </p>
        </div>
      );
    }

    return (
      <ul className="space-y-2 max-h-[300px] overflow-y-auto chat-messages-container pr-2">
        {notifications.map((notification) => {
          const NotificationIcon = notificationIcons[notification.type];
          const colorClass = notificationColors[notification.type];
          return (
            <li
              key={notification.id}
              className={`flex items-start justify-between p-3 rounded-md ${
                notification.read
                  ? "bg-[var(--chat-notification-read-bg)]"
                  : "bg-[var(--chat-notification-unread-bg)]"
              } hover:bg-[var(--chat-notification-hover-bg)] transition-colors duration-200`}
              aria-label={
                notification.read ? "Read notification" : "Unread notification"
              }
            >
              <div className="flex gap-2">
                <div className={`mt-0.5 ${colorClass}`}>
                  <NotificationIcon className="h-4 w-4" />
                </div>
                <div>
                  <p
                    className={`${
                      notification.read ? "font-normal" : "font-medium"
                    } text-sm`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-xs text-[var(--chat-message-system-text)]">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 bg-[var(--chat-notification-background)] text-[var(--chat-notification-text)]"
                      >
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
                    className="text-[var(--chat-knowledge-text)] hover:text-[var(--chat-knowledge-text)]/80 p-1 rounded-sm hover:bg-[var(--chat-notification-hover)] transition-colors"
                    aria-label="Mark as read"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-[var(--chat-message-system-text)] hover:text-[var(--chat-notification-text)] p-1 rounded-sm hover:bg-[var(--chat-notification-hover)] transition-colors"
                  aria-label="Dismiss notification"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
