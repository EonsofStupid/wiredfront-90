
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { GitHubTokenForm } from "./components/GitHubTokenForm";
import { GitHubTokenValidation } from "./components/GitHubTokenValidation";
import { useGitHubTokenValidation } from "@/hooks/github/useGitHubTokenValidation";

interface GitHubTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenAdded: () => void;
}

export function GitHubTokenDialog({ isOpen, onClose, onTokenAdded }: GitHubTokenDialogProps) {
  const {
    tokenName,
    setTokenName,
    token,
    setToken,
    isLoading,
    validationState,
    validationResult,
    error,
    handleSubmit,
    handleClose
  } = useGitHubTokenValidation(onTokenAdded, onClose);

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
