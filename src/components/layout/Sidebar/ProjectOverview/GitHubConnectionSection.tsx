
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

interface GitHubConnectionSectionProps {
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  username: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export function GitHubConnectionSection({
  isConnected,
  isChecking,
  connectionStatus,
  username,
  onConnect,
  onDisconnect,
  className
}: GitHubConnectionSectionProps) {
  return (
    <div className={cn("p-4 border-b border-neon-blue/20", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GithubIcon className="h-5 w-5 text-neon-blue" />
          <span className="text-sm font-medium">GitHub</span>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Connected as {username}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDisconnect}
              className="h-7 text-xs text-neon-pink hover:text-neon-pink hover:bg-neon-pink/10"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            disabled={isChecking || connectionStatus === 'connecting'}
            onClick={onConnect}
            className="h-7 text-xs border-neon-blue text-neon-blue hover:bg-neon-blue/10"
          >
            {isChecking || connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
    </div>
  );
}
