
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { GitHubTokenCard } from "./GitHubTokenCard";
import { GitHubTokenDialog } from "./GitHubTokenDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, RefreshCw, Github, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/role";

export function GitHubTokenManagement() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const { hasRole } = useRoleStore();
  const isSuperAdmin = hasRole('super_admin');

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to manage GitHub tokens");
        return;
      }

      const result = await supabase.functions.invoke('github-token-management', {
        body: { action: 'get' },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch GitHub tokens');
      }

      setTokens(result.data.tokens || []);
    } catch (error) {
      console.error('Error fetching GitHub tokens:', error);
      toast.error('Failed to fetch GitHub tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (token: any) => {
    setSelectedToken(token);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedToken) return;
    
    try {
      setIsLoading(true);
      
      const result = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'delete', 
          tokenData: { 
            id: selectedToken.id,
            secret_key_name: selectedToken.secret_key_name
          } 
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete GitHub token');
      }

      toast.success('GitHub token deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchTokens();
    } catch (error) {
      console.error('Error deleting GitHub token:', error);
      toast.error('Failed to delete GitHub token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenAdded = () => {
    setIsAddDialogOpen(false);
    fetchTokens();
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <AdminCard requiredRole="super_admin">
      <AdminCardHeader>
        <AdminCardTitle className="flex items-center">
          <Github className="h-5 w-5 mr-2 text-[#8B5CF6]" />
          GitHub API Tokens
        </AdminCardTitle>
        <AdminCardDescription>
          Manage your GitHub API tokens for Git operations and repository access
        </AdminCardDescription>
      </AdminCardHeader>
      
      <AdminCardContent>
        {!isSuperAdmin && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start">
            <Shield className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Only Super Admins can manage GitHub API tokens. These tokens are used for secure GitHub operations and repository access.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tokens.length > 0 ? (
          <div className="space-y-4">
            {tokens.map((token) => (
              <GitHubTokenCard 
                key={token.id} 
                token={token} 
                onDelete={() => handleDelete(token)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No GitHub Tokens</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any GitHub tokens yet. Tokens are used for secure GitHub operations.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full admin-primary-button"
            disabled={!isSuperAdmin}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add GitHub Token
          </Button>
        </div>
      </AdminCardContent>

      <GitHubTokenDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onTokenAdded={handleTokenAdded}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Token Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the GitHub token "{selectedToken?.memorable_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Token'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminCard>
  );
}
