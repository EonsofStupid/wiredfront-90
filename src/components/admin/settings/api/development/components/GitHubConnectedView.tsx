
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, GitBranch, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GithubMetrics {
  remaining: number;
  limit: number;
  resetTime: string;
  lastChecked: string;
}

interface GitHubConnectedViewProps {
  githubUsername: string | null;
  metrics: GithubMetrics | null;
  isValidating: boolean;
  syncGithubMetrics: () => Promise<void>;
  validateGithubToken: (token: string) => Promise<void>;
  token: string;
}

export function GitHubConnectedView({
  githubUsername,
  metrics,
  isValidating,
  syncGithubMetrics,
  validateGithubToken,
  token
}: GitHubConnectedViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center p-4 rounded-lg bg-muted/50">
        <div className="flex-1">
          <h4 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            GitHub Connected
            {githubUsername && (
              <span className="text-sm flex items-center gap-1">
                (
                <a 
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B5CF6] hover:text-[#7E69AB] transition-colors flex items-center"
                >
                  @{githubUsername}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                )
              </span>
            )}
          </h4>
          
          {metrics && (
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <span>Remaining API calls:</span>
                  <span className={metrics.remaining < 100 ? "text-destructive font-bold" : ""}>
                    {metrics.remaining}/{metrics.limit}
                  </span>
                </Badge>
                
                <Badge variant="outline" className="gap-1">
                  <span>Resets at:</span>
                  <span>{metrics.resetTime}</span>
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last checked: {metrics.lastChecked}
              </div>
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={syncGithubMetrics}
          disabled={isValidating}
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-lg border">
        <div>
          <h4 className="font-medium">Repository Access</h4>
          <p className="text-sm text-muted-foreground">
            GitHub token is used for repository operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => validateGithubToken(token)}
          >
            <GitBranch className="h-3.5 w-3.5" />
            Test Access
          </Button>
        </div>
      </div>
    </div>
  );
}
