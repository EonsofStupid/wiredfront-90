import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { GitHubTokenForm } from "./components/GitHubTokenForm";
import { GitHubTokenValidation } from "./components/GitHubTokenValidation";
import { useState } from "react";

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
    setIsLoading(true);
    setValidationState("validating");
    setError("");

    try {
      // Validate token
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const userData = await response.json();
      setValidationResult({
        user: userData,
        rate_limit: {
          limit: response.headers.get("x-ratelimit-limit"),
          remaining: response.headers.get("x-ratelimit-remaining"),
        },
      });
      setValidationState("valid");
      onTokenAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to validate token");
      setValidationState("invalid");
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
        
        <GitHubTokenForm
          tokenName={tokenName}
          token={token}
          isLoading={isLoading}
          validationState={validationState}
          onTokenNameChange={setTokenName}
          onTokenChange={setToken}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
        
        <GitHubTokenValidation
          error={error}
          validationState={validationState}
          validationResult={validationResult}
        />
      </DialogContent>
    </Dialog>
  );
}
