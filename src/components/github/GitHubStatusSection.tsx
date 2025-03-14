
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, AlertCircle } from "lucide-react";

interface GitHubStatusSectionProps {
  isConnected: boolean;
  username: string | null;
  isCheckingConnection: boolean;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  onConnect: () => void;
  onDisconnect: () => void;
}

export function GitHubStatusSection({
  isConnected,
  username,
  isCheckingConnection,
  connectionStatus,
  onConnect,
  onDisconnect
}: GitHubStatusSectionProps) {
  return (
    <div className="p-4 border-b border-neon-blue/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-neon-blue" />
          <h3 className="font-medium">GitHub Status</h3>
        </div>
        
        {isConnected ? (
          <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
        ) : (
          <Badge className="bg-amber-500 hover:bg-amber-600">Not Connected</Badge>
        )}
      </div>
      
      {isConnected && username && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Connected as: </span>
          <span className="font-medium">@{username}</span>
        </div>
      )}
      
      {!isConnected && (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-neon-blue border-neon-blue hover:bg-neon-blue/10"
            onClick={onConnect}
            disabled={isCheckingConnection || connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="h-4 w-4 mr-2" />
                Connect to GitHub
              </>
            )}
          </Button>
          
          {connectionStatus === 'error' && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Connection failed. Check Settings.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
