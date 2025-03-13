
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { RefreshCw, User, Key } from "lucide-react";

interface GitHubTokenFormProps {
  tokenName: string;
  token: string;
  isLoading: boolean;
  validationState: "idle" | "validating" | "valid" | "invalid";
  onTokenNameChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function GitHubTokenForm({
  tokenName,
  token,
  isLoading,
  validationState,
  onTokenNameChange,
  onTokenChange,
  onSubmit,
  onClose
}: GitHubTokenFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="token-name">Token Name</Label>
        <div className="relative">
          <Input
            id="token-name"
            placeholder="e.g., GitHub Work Account"
            value={tokenName}
            onChange={(e) => onTokenNameChange(e.target.value)}
            className="pr-10"
            disabled={isLoading}
          />
          <User className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          A memorable name to identify this token
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="github-token">GitHub Personal Access Token</Label>
        <div className="relative">
          <Input
            id="github-token"
            type="password"
            placeholder="ghp_..."
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            className="pr-10"
            disabled={isLoading || validationState === "valid"}
          />
          <Key className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Create a token with 'repo' scope from{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B5CF6] hover:underline"
          >
            GitHub Settings
          </a>
        </p>
      </div>
      
      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading || !token || !tokenName}
          className="admin-primary-button"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {validationState === "validating" ? "Validating..." : "Saving..."}
            </>
          ) : (
            "Add Token"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
