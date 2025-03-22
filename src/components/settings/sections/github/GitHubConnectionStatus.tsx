import { Spinner } from "@/components/chat/components/Spinner";
import { Button } from "@/components/ui/button";
import { Github, X } from "lucide-react";

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
  // Only disable the button when actually connecting
  const isButtonDisabled = connectionStatus === 'connecting';

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
          <Button
            variant="outline"
            onClick={onDisconnect}
            disabled={isButtonDisabled}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {connectionStatus === 'connecting' ? (
              <Spinner size="sm" className="mr-2" label="Disconnecting..." />
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onConnect}
            disabled={isButtonDisabled}
            className="border-primary/20 hover:border-primary"
          >
            {connectionStatus === 'connecting' ? (
              <Spinner size="sm" className="mr-2" label="Connecting..." />
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
