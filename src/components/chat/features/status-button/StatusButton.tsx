
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { GitBranchIcon, Bell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitHubStatusDialog } from './GitHubStatusDialog';
import { NotificationsStatusDialog } from './NotificationsStatusDialog';
import { useChatStore } from '../../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

export enum StatusType {
  GITHUB = 'github',
  NOTIFICATIONS = 'notifications'
}

export function StatusButton() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const { features } = useChatStore();
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Example count
  const [gitSyncStatus, setGitSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');

  const handleStatusSelect = (type: StatusType) => {
    logger.info('Status selected', { type });
    setSelectedStatus(type);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedStatus(null);
    }
  };

  // Status indicators
  const hasNotifications = unreadNotifications > 0;
  const gitStatusActive = gitSyncStatus === 'synced';

  return (
    <div className="flex items-center gap-2">
      {/* GitHub Status Button */}
      {features.githubSync && (
        <HoverCard openDelay={300} closeDelay={200}>
          <HoverCardTrigger asChild>
            <Dialog open={selectedStatus === StatusType.GITHUB} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${gitStatusActive ? 'text-green-500' : 'text-chat-knowledge-text'} hover:bg-chat-message-assistant-bg/20`}
                  onClick={() => handleStatusSelect(StatusType.GITHUB)}
                >
                  <GitBranchIcon className="h-5 w-5" />
                  {gitStatusActive && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </Button>
              </DialogTrigger>
              <GitHubStatusDialog />
            </Dialog>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="center" 
            className="w-64 p-4 chat-dialog-content border-chat-knowledge-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <GitBranchIcon className="h-4 w-4 text-chat-knowledge-text" />
              <h4 className="font-medium text-chat-knowledge-text">GitHub Status</h4>
              <Badge 
                variant={gitStatusActive ? "success" : "outline"} 
                className="ml-auto text-xs"
              >
                {gitSyncStatus === 'idle' ? 'Not Synced' : 
                 gitSyncStatus === 'syncing' ? 'Syncing...' : 
                 gitSyncStatus === 'synced' ? 'Active' : 'Failed'}
              </Badge>
            </div>
            <p className="text-xs text-white/70">Last commit: 15 minutes ago</p>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Notifications Status Button */}
      {features.notifications && (
        <HoverCard openDelay={300} closeDelay={200}>
          <HoverCardTrigger asChild>
            <Dialog open={selectedStatus === StatusType.NOTIFICATIONS} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${hasNotifications ? 'text-primary' : 'text-chat-knowledge-text'} hover:bg-chat-message-assistant-bg/20`}
                  onClick={() => handleStatusSelect(StatusType.NOTIFICATIONS)}
                >
                  <Bell className="h-5 w-5" />
                  {hasNotifications && (
                    <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <NotificationsStatusDialog />
            </Dialog>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="center" 
            className="w-64 p-4 chat-dialog-content border-chat-knowledge-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-chat-knowledge-text" />
              <h4 className="font-medium text-chat-knowledge-text">Notifications</h4>
              <Badge 
                variant={hasNotifications ? "default" : "outline"} 
                className="ml-auto text-xs"
              >
                {unreadNotifications} New
              </Badge>
            </div>
            <p className="text-xs text-white/70">Latest: New commit pushed to repository</p>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Status Overview Button (when both are enabled) */}
      {features.githubSync && features.notifications && (
        <HoverCard openDelay={300} closeDelay={200}>
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-message-assistant-bg/20"
            >
              <Activity className="h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="center" 
            className="w-64 p-4 chat-dialog-content border-chat-knowledge-border"
          >
            <div className="space-y-3">
              <h4 className="font-medium text-chat-knowledge-text mb-2">Status Overview</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <GitBranchIcon className="h-3 w-3 text-chat-knowledge-text" />
                  <span className="text-white/70">GitHub:</span>
                </div>
                <Badge 
                  variant={gitStatusActive ? "success" : "outline"} 
                  className="text-xs justify-self-end"
                >
                  {gitSyncStatus === 'synced' ? 'Active' : 'Inactive'}
                </Badge>
                
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3 text-chat-knowledge-text" />
                  <span className="text-white/70">Notifications:</span>
                </div>
                <Badge 
                  variant={hasNotifications ? "default" : "outline"} 
                  className="text-xs justify-self-end"
                >
                  {unreadNotifications} Unread
                </Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
