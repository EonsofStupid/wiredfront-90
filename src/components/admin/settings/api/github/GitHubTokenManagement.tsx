
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Plus, Trash2, RefreshCw, ExternalLink, Info, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/role";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { GitHubTokenDialog } from "./GitHubTokenDialog";
import { GitHubTokenCard } from "./GitHubTokenCard";

export function GitHubTokenManagement() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hasRole } = useRoleStore();
  const isSuperAdmin = hasRole('super_admin');
  
  useEffect(() => {
    fetchTokens();
  }, []);
  
  const fetchTokens = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { action: 'get' }
      });
      
      if (error) throw error;
      setTokens(data.tokens || []);
    } catch (error) {
      console.error('Error fetching GitHub tokens:', error);
      toast.error('Failed to load GitHub tokens');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToken = async (tokenData: any) => {
    try {
      // First validate token
      const { data: validateData, error: validateError } = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'validate',
          tokenData
        }
      });
      
      if (validateError) throw validateError;
      
      // Add GitHub username to the token data
      const enhancedTokenData = {
        ...tokenData,
        github_username: validateData.user.login
      };
      
      // Save token
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'save',
          tokenData: enhancedTokenData
        }
      });
      
      if (error) throw error;
      
      toast.success('GitHub token added successfully');
      fetchTokens();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding GitHub token:', error);
      toast.error('Failed to add GitHub token');
    }
  };
  
  const handleDeleteToken = async (token: any) => {
    if (!confirm(`Are you sure you want to delete the token "${token.memorable_name}"?`)) {
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'delete',
          tokenData: {
            id: token.id,
            secret_key_name: token.secret_key_name
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('GitHub token deleted successfully');
      fetchTokens();
    } catch (error) {
      console.error('Error deleting GitHub token:', error);
      toast.error('Failed to delete GitHub token');
    }
  };
  
  return (
    <SettingsContainer
      title="GitHub Token Management"
      description="Manage your GitHub API tokens for repository access and integration"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">API Tokens</h3>
            <p className="text-sm text-muted-foreground">
              Manage your GitHub personal access tokens
            </p>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="admin-primary-button"
                  disabled={!isSuperAdmin}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Token
                </Button>
              </TooltipTrigger>
              {!isSuperAdmin && (
                <TooltipContent>
                  <p>Only Super Admins can add GitHub tokens</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="rounded-full bg-primary/10 p-3 mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No GitHub tokens</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Add a GitHub token to enable repository access and integration features
            </p>
            {isSuperAdmin && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 admin-primary-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Token
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {tokens.map((token) => (
              <GitHubTokenCard 
                key={token.id}
                token={token}
                onDelete={() => handleDeleteToken(token)}
              />
            ))}
          </div>
        )}
      </div>
      
      <GitHubTokenDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddToken}
      />
    </SettingsContainer>
  );
}
