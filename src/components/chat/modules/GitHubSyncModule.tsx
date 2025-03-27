
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranchIcon, RefreshCwIcon, GitCommitIcon } from "lucide-react";
import { toast } from "sonner";

export function GitHubSyncModule() {
  const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  
  const handleSync = () => {
    setSyncStatus('syncing');
    
    // Simulate a sync operation
    setTimeout(() => {
      setSyncStatus('synced');
      toast.success('Successfully synced with GitHub');
    }, 1500);
  };
  
  return (
    <Card className="w-full my-2 border-dashed border-primary/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center">
            <GitBranchIcon className="h-4 w-4 mr-2" />
            GitHub Integration
          </h3>
          <Badge 
            variant={syncStatus === 'synced' ? "success" : syncStatus === 'failed' ? "destructive" : "outline"} 
            className="text-xs"
          >
            {syncStatus === 'idle' ? 'Not Synced' : 
             syncStatus === 'syncing' ? 'Syncing...' : 
             syncStatus === 'synced' ? 'Synced' : 'Failed'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <GitCommitIcon className="h-3 w-3" />
          <span>Last commit: 15 minutes ago</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4"
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCwIcon className="h-3 w-3 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCwIcon className="h-3 w-3 mr-2" />
              Sync with GitHub
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
