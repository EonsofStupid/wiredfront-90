
import React from 'react';
import { GitBranchIcon, BellIcon, CheckCircle, Clock } from 'lucide-react';

interface GitHubPreviewProps {
  lastCommitTime: string;
  isSynced: boolean;
}

export const GitHubPreview: React.FC<GitHubPreviewProps> = ({ lastCommitTime, isSynced }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Last commit</span>
        <span className="text-xs font-medium">{lastCommitTime}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Status</span>
        <div className="flex items-center gap-1">
          <CheckCircle className={`h-3 w-3 ${isSynced ? 'text-green-500' : 'text-yellow-500'}`} />
          <span className="text-xs">{isSynced ? 'Synced' : 'Out of sync'}</span>
        </div>
      </div>
    </div>
  );
};

interface NotificationsPreviewProps {
  unreadCount: number;
  lastUpdated: string;
}

export const NotificationsPreview: React.FC<NotificationsPreviewProps> = ({ unreadCount, lastUpdated }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Unread</span>
        <span className="text-xs font-medium">{unreadCount}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Last update</span>
        <span className="text-xs">{lastUpdated}</span>
      </div>
    </div>
  );
};

interface StatusButtonPreviewProps {
  type: 'github' | 'notifications';
}

export const StatusButtonPreview: React.FC<StatusButtonPreviewProps> = ({ type }) => {
  const Icon = type === 'github' ? GitBranchIcon : BellIcon;
  const title = type === 'github' ? 'GitHub Status' : 'Notifications';

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h4>
      
      {type === 'github' ? (
        <GitHubPreview lastCommitTime="15 minutes ago" isSynced={true} />
      ) : (
        <NotificationsPreview unreadCount={2} lastUpdated="Just now" />
      )}
    </div>
  );
};
