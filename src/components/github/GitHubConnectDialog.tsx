
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Github, HelpCircle, Terminal } from "lucide-react";
import { useState } from "react";

interface GitHubConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  errorMessage: string | null;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  debugInfo?: any;
}

export function GitHubConnectDialog({
  open,
  onOpenChange,
  onConnect,
  errorMessage,
  connectionStatus,
  debugInfo
}: GitHubConnectDialogProps) {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Connect to GitHub</DialogTitle>
          <DialogDescription>
            Connecting to GitHub allows you to sync your projects, access repositories, and collaborate on code.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && connectionStatus === 'error' && (
          <div className="p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-medium mb-1">GitHub Connection Error</p>
              <p className="text-sm">{errorMessage}</p>
              
              {errorMessage.includes('not configured') && (
                <p className="text-sm">
                  Make sure the GitHub client ID and secret are configured in your Supabase Edge Function secrets.
                </p>
              )}
              
              {debugInfo && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    <Terminal className="h-3 w-3" />
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                  </Button>
                  
                  {showDebug && (
                    <pre className="mt-2 text-xs p-2 bg-slate-800 text-slate-200 rounded overflow-auto max-h-24">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={connectionStatus === 'connecting'}
          >
            Cancel
          </Button>
          <Button 
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
                Connect
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
