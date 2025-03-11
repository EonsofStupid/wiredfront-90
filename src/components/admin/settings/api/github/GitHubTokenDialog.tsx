
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Github, RefreshCw, AlertCircle, ShieldCheck, User, Key } from "lucide-react";

interface GitHubTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenAdded: () => void;
}

export function GitHubTokenDialog({ isOpen, onClose, onTokenAdded }: GitHubTokenDialogProps) {
  const [tokenName, setTokenName] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenName.trim()) {
      setError("Please enter a token name");
      return;
    }
    
    if (!token.trim()) {
      setError("Please enter a valid GitHub token");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Validate token
      setValidationState("validating");
      const validateResult = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'validate', 
          tokenData: { token }
        },
      });
      
      if (validateResult.error) {
        setValidationState("invalid");
        setError(validateResult.error.message || "Invalid GitHub token");
        return;
      }
      
      setValidationState("valid");
      setValidationResult(validateResult.data);
      
      // Save token
      const saveResult = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'save', 
          tokenData: { 
            name: tokenName,
            token,
            github_username: validateResult.data.user.login,
            scopes: ["repo", "read:user"],
            rate_limit: validateResult.data.rate_limit
          }
        },
      });
      
      if (saveResult.error) {
        throw new Error(saveResult.error.message || "Failed to save GitHub token");
      }
      
      toast.success("GitHub token added successfully");
      setTokenName("");
      setToken("");
      setValidationState("idle");
      setValidationResult(null);
      onTokenAdded();
    } catch (error: any) {
      console.error("Error adding GitHub token:", error);
      toast.error(error.message || "Failed to add GitHub token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTokenName("");
    setToken("");
    setValidationState("idle");
    setValidationResult(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Github className="h-5 w-5 mr-2 text-[#8B5CF6]" />
            Add GitHub Token
          </DialogTitle>
          <DialogDescription>
            Enter a Personal Access Token (PAT) from GitHub to enable repository operations
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token-name">Token Name</Label>
            <div className="relative">
              <Input
                id="token-name"
                placeholder="e.g., GitHub Work Account"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
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
                onChange={(e) => setToken(e.target.value)}
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
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}
          
          {validationState === "valid" && validationResult && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-100">Token is valid!</p>
                <p>Connected to GitHub account: <span className="font-medium">@{validationResult.user.login}</span></p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rate limit: {validationResult.rate_limit.remaining}/{validationResult.rate_limit.limit} requests remaining
                </p>
              </div>
            </div>
          )}
        
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
}
