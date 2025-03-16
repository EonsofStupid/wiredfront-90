
import React from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon, RefreshCw } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';

export function GitHubInfoDialog() {
  // This would be connected to real GitHub data in a production app
  const repoStatus = {
    connected: true,
    lastSync: new Date().toISOString(),
    branch: 'main',
    commits: [
      { id: 'abc123', message: 'Update styling', author: 'User', time: '15 minutes ago' },
      { id: 'def456', message: 'Fix bugs', author: 'User', time: '2 hours ago' }
    ]
  };

  const handleRefresh = () => {
    logger.info('GitHub info refreshed');
  };

  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-chat-knowledge-text">
          <GitBranchIcon className="h-5 w-5" />
          GitHub Integration
        </DialogTitle>
        <DialogDescription>
          View and manage your connected GitHub repository
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="text-sm font-medium flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Connected
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Repository</span>
          <span className="text-sm font-medium">user/repo</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Branch</span>
          <span className="text-sm font-medium">{repoStatus.branch}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last synced</span>
          <span className="text-sm font-medium">
            {new Date(repoStatus.lastSync).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Recent commits</h4>
          <div className="space-y-2">
            {repoStatus.commits.map(commit => (
              <div key={commit.id} className="text-xs p-2 border border-chat-knowledge-border rounded">
                <div className="font-mono text-chat-knowledge-text">{commit.id.substring(0, 7)}</div>
                <div className="mt-1">{commit.message}</div>
                <div className="mt-1 text-muted-foreground flex justify-between">
                  <span>{commit.author}</span>
                  <span>{commit.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
