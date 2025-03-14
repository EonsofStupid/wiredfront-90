
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { GitHubUserBadge } from "@/components/github/GitHubUserBadge";
import { GitHubConnectionState } from "@/types/admin/settings/github";

interface GitHubConnectionSectionProps {
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: GitHubConnectionState | {
    status: string;
    lastCheck: string;
    errorMessage?: string;
    metadata?: {
      username?: string;
      [key: string]: any;
    };
  };
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
  // Determine if the connection is in the connecting state
  const isConnecting = isChecking || 
    (typeof connectionStatus === 'string' ? 
      connectionStatus === 'connecting' : 
      connectionStatus.status === 'connecting');

  return (
    <div className={cn(
      "p-4 border-b border-neon-blue/20",
      "bg-gradient-to-r from-dark-lighter/30 to-dark-lighter/10",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GithubIcon className="h-5 w-5 text-neon-blue" />
          <span className="text-sm font-medium text-neon-blue/90">GitHub</span>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-2">
            <GitHubUserBadge username={username} />
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
            disabled={isConnecting}
            onClick={onConnect}
            className="h-7 text-xs border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:shadow-[0_0_8px_theme(colors.neon.blue)]"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
    </div>
  );
}
