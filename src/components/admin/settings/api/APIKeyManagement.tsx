
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, RefreshCw, Shield, AlertCircle, Key, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/role";
import { APIKeyCard } from "./APIKeyCard";
import { APIKeyDialog } from "./APIKeyDialog";
import { APIType } from "@/types/admin/settings/api-configuration";

export function APIKeyManagement() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const { hasRole } = useRoleStore();
  const isSuperAdmin = hasRole('super_admin');

  const fetchAPIKeys = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to manage API keys");
        return;
      }

      const result = await supabase.functions.invoke('manage-api-secret', {
        body: { action: 'list' },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch API keys');
      }

      setApiKeys(result.data.configurations || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (key: any) => {
    setSelectedKey(key);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedKey) return;
    
    try {
      setIsLoading(true);
      
      const result = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          action: 'delete', 
          secretName: selectedKey.secret_key_name,
          provider: selectedKey.api_type,
          memorableName: selectedKey.memorable_name
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete API key');
      }

      toast.success('API key deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchAPIKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyAdded = () => {
    setIsAddDialogOpen(false);
    fetchAPIKeys();
  };

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  return (
    <AdminCard requiredRole="super_admin">
      <AdminCardHeader>
        <AdminCardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2 text-[#8B5CF6]" />
          API Key Management
        </AdminCardTitle>
        <AdminCardDescription>
          Securely manage API keys for AI services and other integrations
        </AdminCardDescription>
      </AdminCardHeader>
      
      <AdminCardContent>
        {!isSuperAdmin && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start">
            <Shield className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Only Super Admins can manage API keys. These keys are used for secure integrations with various services.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : apiKeys.length > 0 ? (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <APIKeyCard 
                key={key.id} 
                apiKey={key} 
                onDelete={() => handleDelete(key)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any API keys yet. Add keys to use AI services and other integrations.
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
            Add New API Key
          </Button>
        </div>
      </AdminCardContent>

      <APIKeyDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onKeyAdded={handleKeyAdded}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm API Key Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the API key "{selectedKey?.memorable_name}"? This action cannot be undone.
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
              {isLoading ? 'Deleting...' : 'Delete Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminCard>
  );
}
