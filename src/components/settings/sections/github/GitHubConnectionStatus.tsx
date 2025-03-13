
import { Button } from "@/components/ui/button";
import { X, Github, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/chat/components/Spinner";

interface GitHubConnectionStatusProps {
  isConnected: boolean;
  username: string | null;
  loading: boolean;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  onConnect: () => void;
  onDisconnect: () => void;
}

export function GitHubConnectionStatus({
  isConnected,
  username,
  loading,
  connectionStatus,
  onConnect,
  onDisconnect
}: GitHubConnectionStatusProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Github className="h-8 w-8" />
        <div>
          <h3 className="font-medium">GitHub</h3>
          {isConnected && username ? (
            <p className="text-sm text-muted-foreground">Connected as @{username}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Not connected</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Button
              variant="outline"
              onClick={onDisconnect}
              disabled={loading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" label="Disconnecting..." />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={onConnect}
            disabled={loading || connectionStatus === 'connecting'}
            className="border-primary/20 hover:border-primary"
          >
            {loading || connectionStatus === 'connecting' ? (
              <>
                <Spinner size="sm" className="mr-2" label={loading ? "Checking..." : "Connecting..."} />
                {loading ? "Checking..." : "Connecting..."}
              </>
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Connect GitHub
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
