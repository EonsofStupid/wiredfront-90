
import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon, BellIcon } from 'lucide-react';
import { GitHubStatusDialog } from './GitHubStatusDialog';
import { NotificationsStatusDialog } from './NotificationsStatusDialog';
import { AIProviderStatusButton } from './AIProviderStatusButton';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useChatStore } from '../../store/chatStore';
import { useErrorBoundary } from '../../hooks/useErrorBoundary';

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

  return (
    <ErrorBoundary fallback={<div className="text-xs text-destructive">Error loading status</div>}>
      <div className="flex gap-2 justify-end" role="toolbar" aria-label="Status controls">
        {/* AI Provider Status Button */}
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
