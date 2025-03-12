
import React, { useState } from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranchIcon, RefreshCwIcon, GitCommitIcon } from "lucide-react";
import { toast } from "sonner";
import { logger } from '@/services/chat/LoggingService';

export function GitHubStatusDialog() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  
  const handleSync = () => {
    setSyncStatus('syncing');
    logger.info('GitHub sync started');
    
    // Simulate a sync operation
    setTimeout(() => {
      setSyncStatus('synced');
      logger.info('GitHub sync completed');
      toast.success('Successfully synced with GitHub');
    }, 1500);
  };
  
  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-chat-knowledge-text">
          <GitBranchIcon className="h-5 w-5" />
          GitHub Integration
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Sync Status</h3>
          <Badge 
            variant={syncStatus === 'synced' ? "success" : syncStatus === 'failed' ? "destructive" : "outline"} 
            className="text-xs"
          >
            {syncStatus === 'idle' ? 'Not Synced' : 
             syncStatus === 'syncing' ? 'Syncing...' : 
             syncStatus === 'synced' ? 'Synced' : 'Failed'}
          </Badge>
        </div>
        
        <div className="rounded-md border border-chat-knowledge-border/30 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Last commit</span>
            <span className="text-sm font-medium">15 minutes ago</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Repository</span>
            <span className="text-sm font-medium">main/wiredFRONT</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Branch</span>
            <span className="text-sm font-medium">feature/chat-improvements</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Author</span>
            <span className="text-sm font-medium">dev@example.com</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <GitCommitIcon className="h-3 w-3" />
          <span>Recent activity: 3 commits in the last hour</span>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          className="w-full text-chat-knowledge-text border-chat-knowledge-border"
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Sync with GitHub
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
