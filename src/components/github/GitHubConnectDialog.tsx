
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Github, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  errorMessage: string | null;
}

export function GitHubConnectDialog({
  open,
  onOpenChange,
  onConnect,
  connectionStatus,
  errorMessage
}: GitHubConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Connect to GitHub
          </DialogTitle>
          <DialogDescription>
            Connect your GitHub account to enable repository creation and synchronization.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center pb-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onConnect}
              disabled={connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect with GitHub
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              This will redirect you to GitHub for authorization
            </p>
          </div>
          
          {errorMessage && connectionStatus === 'error' && (
            <Alert variant="destructive" className="bg-red-500/10 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-md border p-3">
            <h4 className="text-sm font-medium mb-2">What this allows:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Creating repositories for your projects</li>
              <li>• Syncing code changes automatically</li>
              <li>• Collaborating with team members</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <a 
              href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-neon-blue flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Learn about GitHub OAuth
            </a>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
