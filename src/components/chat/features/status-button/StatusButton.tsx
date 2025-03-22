import { useErrorBoundary } from '@/components/chat/hooks/useErrorBoundary';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useChatStore } from '@/stores/chat/chatStore';
import { BellIcon, CheckCircle, GitBranchIcon } from 'lucide-react';
import { useState } from 'react';
import { AIProviderStatusButton } from './AIProviderStatusButton';
import { GitHubStatusDialog } from './GitHubStatusDialog';
import { NotificationsStatusDialog } from './NotificationsStatusDialog';

export function StatusButton() {
  const [activeTab, setActiveTab] = useState<'github' | 'notifications'>('github');
  const { features } = useChatStore();
  const { ErrorBoundary } = useErrorBoundary();

  const getDialogContent = () => {
    if (activeTab === 'github') {
      return <GitHubStatusDialog />;
    }
    return <NotificationsStatusDialog />;
  };

  const getPreviewContent = (type: 'github' | 'notifications') => {
    if (type === 'github') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last commit</span>
            <span className="text-xs font-medium">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs">Synced</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Unread</span>
          <span className="text-xs font-medium">2</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Last update</span>
          <span className="text-xs">Just now</span>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={<div className="text-xs text-destructive">Error loading status</div>}>
      <div className="flex gap-2 justify-end" role="toolbar" aria-label="Status controls">
        {/* AI Provider Status Button - Added first in the list */}
        <AIProviderStatusButton />

        {features.githubSync && (
          <Dialog>
            <HoverCard openDelay={300} closeDelay={200}>
              <HoverCardTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-background/10"
                    onClick={() => setActiveTab('github')}
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
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <GitBranchIcon className="h-3.5 w-3.5" />
                    GitHub Status
                  </h4>
                  {getPreviewContent('github')}
                </div>
              </HoverCardContent>
            </HoverCard>
            {activeTab === 'github' && getDialogContent()}
          </Dialog>
        )}

        {features.notifications && (
          <Dialog>
            <HoverCard openDelay={300} closeDelay={200}>
              <HoverCardTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-chat-notification-text border-chat-notification-border hover:bg-chat-notification-background/10 relative"
                    onClick={() => setActiveTab('notifications')}
                    aria-label="Notifications"
                  >
                    <BellIcon className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
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
                    <BellIcon className="h-3.5 w-3.5" />
                    Notifications
                  </h4>
                  {getPreviewContent('notifications')}
                </div>
              </HoverCardContent>
            </HoverCard>
            {activeTab === 'notifications' && getDialogContent()}
          </Dialog>
        )}
      </div>
    </ErrorBoundary>
  );
}
