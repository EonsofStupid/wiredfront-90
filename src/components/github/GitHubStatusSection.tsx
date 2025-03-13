
import { Button } from "@/components/ui/button";
import { Github, X, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitHubStatusSectionProps {
  isConnected: boolean;
  username: string | null;
  isCheckingConnection: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
}

export function GitHubStatusSection({
  isConnected,
  username,
  isCheckingConnection,
  onConnect,
  onDisconnect,
  connectionStatus
}: GitHubStatusSectionProps) {
  return (
    <div className="p-4 border-b border-neon-blue/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-neon-pink" />
          <h3 className="font-medium">GitHub</h3>
        </div>
        
        {isCheckingConnection ? (
          <div className="animate-pulse flex items-center">
            <RefreshCw className="h-4 w-4 mr-1.5 animate-spin text-gray-400" />
            <span className="text-xs text-gray-400">Checking...</span>
          </div>
        ) : isConnected ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400">
            <Check className="h-3 w-3 mr-1" /> Connected
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/20 text-red-400">
            <X className="h-3 w-3 mr-1" /> Disconnected
          </span>
        )}
      </div>
      
      {isConnected && username ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            Connected as <span className="text-neon-blue">@{username}</span>
          </p>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-auto py-1.5 text-destructive hover:bg-destructive/10"
            onClick={onDisconnect}
            disabled={isCheckingConnection}
          >
            {isCheckingConnection ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-auto py-2 border-primary/20 hover:border-primary"
            onClick={onConnect}
            disabled={connectionStatus === 'connecting' || isCheckingConnection}
          >
            {connectionStatus === 'connecting' || isCheckingConnection ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isCheckingConnection ? 'Checking...' : 'Connecting...'}
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Connect GitHub
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
