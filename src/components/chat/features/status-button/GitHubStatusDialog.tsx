
import React, { useState, useCallback, useEffect } from 'react';
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
  GitBranchIcon, 
  RefreshCwIcon, 
  GitCommitIcon, 
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  GitFork
} from "lucide-react";
import { toast } from "sonner";
import { logger } from '@/services/chat/LoggingService';
import { Skeleton } from '@/components/ui/skeleton';

interface GitHubRepositoryInfo {
  repoName: string;
  branch: string;
  lastCommit: {
    message: string;
    timestamp: string;
    author: string;
    hash: string;
  };
  commitCount: number;
}

export function GitHubStatusDialog() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [repoInfo, setRepoInfo] = useState<GitHubRepositoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchRepositoryInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call in production
      logger.info('Fetching GitHub repository info');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRepoInfo({
        repoName: 'main/wiredFRONT',
        branch: 'feature/chat-improvements',
        lastCommit: {
          message: 'Optimize chat performance',
          timestamp: new Date().toISOString(),
          author: 'dev@example.com',
          hash: 'a1b2c3d4'
        },
        commitCount: 3
      });
      
      logger.info('GitHub repository info fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch GitHub repository info', { error });
      toast.error('Failed to load repository info');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchRepositoryInfo();
  }, [fetchRepositoryInfo]);
  
  const handleSync = () => {
    setSyncStatus('syncing');
    logger.info('GitHub sync started');
    
    // Simulate a sync operation
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      logger.info('GitHub sync completed');
      toast.success('Successfully synced with GitHub');
    }, 1500);
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };
  
  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-chat-knowledge-text">
          <GitBranchIcon className="h-5 w-5" />
          GitHub Integration
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs">
          Manage repository synchronization and view recent activity
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Sync Status</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={syncStatus === 'synced' ? "success" : syncStatus === 'failed' ? "destructive" : "outline"} 
              className="text-xs"
            >
              {syncStatus === 'idle' ? 'Not Synced' : 
              syncStatus === 'syncing' ? 'Syncing...' : 
              syncStatus === 'synced' ? 'Synced' : 'Failed'}
            </Badge>
            
            {lastSyncTime && (
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(lastSyncTime)}
              </span>
            )}
          </div>
        </div>
        
        <div className="rounded-md border border-chat-knowledge-border/30 p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-3/5" />
            </div>
          ) : !repoInfo ? (
            <div className="text-center py-2 flex flex-col items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Failed to load repository information</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchRepositoryInfo}
                className="mt-2"
              >
                <RefreshCwIcon className="h-3 w-3 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Last commit</span>
                <span className="text-sm font-medium">{formatTimeAgo(new Date(repoInfo.lastCommit.timestamp))}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Repository</span>
                <span className="text-sm font-medium">{repoInfo.repoName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Branch</span>
                <span className="text-sm font-medium">{repoInfo.branch}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Author</span>
                <span className="text-sm font-medium">{repoInfo.lastCommit.author}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Commit Message</span>
                <span className="text-sm font-medium truncate max-w-[200px]">{repoInfo.lastCommit.message}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <GitCommitIcon className="h-3 w-3" />
          <span>
            Recent activity: {isLoading ? (
              <Skeleton className="h-3 w-24 inline-block align-middle" />
            ) : (
              `${repoInfo?.commitCount || 0} commits in the last hour`
            )}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5">
            <GitFork className="h-4 w-4 mb-1 text-chat-knowledge-text" />
            <div className="text-xs font-medium">3 Branches</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5">
            <GitCommitIcon className="h-4 w-4 mb-1 text-chat-knowledge-text" />
            <div className="text-xs font-medium">24 Commits</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5">
            <Clock className="h-4 w-4 mb-1 text-chat-knowledge-text" />
            <div className="text-xs font-medium">Updated today</div>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRepositoryInfo}
          disabled={isLoading}
          className="text-chat-knowledge-text border-chat-knowledge-border"
        >
          <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="default" 
          className="w-full text-white bg-gradient-to-r from-[#1EAEDB] to-[#0080B3] border-chat-knowledge-border hover:opacity-90"
          onClick={handleSync}
          disabled={syncStatus === 'syncing' || isLoading}
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              {syncStatus === 'synced' ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <RefreshCwIcon className="h-4 w-4 mr-2" />
              )}
              Sync with GitHub
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
