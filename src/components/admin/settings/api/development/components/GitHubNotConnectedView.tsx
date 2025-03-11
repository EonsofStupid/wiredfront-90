
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Info, Loader2 } from "lucide-react";

interface GitHubNotConnectedViewProps {
  newGithubToken: string;
  setNewGithubToken: (value: string) => void;
  isValidating: boolean;
  validateGithubToken: (token: string) => Promise<void>;
}

export function GitHubNotConnectedView({
  newGithubToken,
  setNewGithubToken,
  isValidating,
  validateGithubToken
}: GitHubNotConnectedViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center p-4 rounded-lg bg-muted/50">
        <div className="flex-1">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            GitHub Not Connected
          </h4>
          <p className="text-sm text-muted-foreground">
            Add a GitHub token to enable repository access
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="password"
            placeholder="Enter your GitHub personal access token"
            value={newGithubToken}
            onChange={(e) => setNewGithubToken(e.target.value)}
          />
          
          <Button
            onClick={() => validateGithubToken(newGithubToken)}
            disabled={isValidating || !newGithubToken}
            variant="outline"
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Validate
          </Button>
        </div>
        
        <p className="text-xs flex items-center text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          Token needs 'repo' scope for full repository access
        </p>
      </div>
    </div>
  );
}
