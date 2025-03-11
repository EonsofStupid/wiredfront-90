
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";

interface GitHubTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tokenData: { name: string; token: string }) => void;
}

export function GitHubTokenDialog({ open, onOpenChange, onSave }: GitHubTokenDialogProps) {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !token) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        name,
        token,
      });
      
      // Reset form
      setName('');
      setToken('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add GitHub Token</DialogTitle>
          <DialogDescription>
            Enter a GitHub personal access token to enable repository access and integration features.
            This token will be stored securely and can only be managed by Super Admins.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="token-name">Token Name</Label>
            <Input
              id="token-name"
              placeholder="e.g., Main GitHub Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              A memorable name to identify this token
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token-value">Personal Access Token</Label>
            <Input
              id="token-value"
              type="password"
              placeholder="ghp_***********************************"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <HelpCircle className="h-3 w-3 mr-1 inline" />
              <span>
                Create a new token with <strong>repo</strong> scope in your{" "}
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub settings
                </a>
              </span>
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name || !token}
              className="admin-primary-button"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : 'Save Token'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
