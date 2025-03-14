
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { GitHubUserBadge } from "@/components/github/GitHubUserBadge";
import { GitHubConnectionStatusProps } from "@/types/admin/settings/github";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GitHubConnectionSectionProps {
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: GitHubConnectionStatusProps;
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
  const isConnecting = isChecking || connectionStatus.status === 'connecting';

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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onDisconnect}
                    className="relative flex items-center justify-center h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    aria-label="Disconnect GitHub"
                  >
                    <span className="absolute inset-0 rounded-full animate-pulse bg-red-500/50"></span>
                    <span className="absolute inset-0 rounded-full shadow-[0_0_8px_theme(colors.red.500)] animate-pulse"></span>
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-dark-lighter/90 border-neon-pink/30 text-neon-pink shadow-md shadow-neon-pink/20"
                >
                  Click to disconnect GitHub
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
