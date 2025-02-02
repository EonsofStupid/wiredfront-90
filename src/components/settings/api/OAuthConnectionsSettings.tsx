import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GitHubConnectButton } from "./components/GitHubConnectButton";
import { ConnectionsList } from "./components/ConnectionsList";

export function OAuthConnectionsSettings() {
  const queryClient = useQueryClient();

  const { data: connections, isLoading } = useQuery({
    queryKey: ['oauth-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'github')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'disconnect',
          status: 'pending',
          metadata: { connection_id: connectionId }
        });

      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;

      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'disconnect',
          status: 'success',
          metadata: { connection_id: connectionId }
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
      toast.success('GitHub connection removed successfully');
    },
    onError: (error) => {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove GitHub connection');
    }
  });

  const toggleDefaultMutation = useMutation({
    mutationFn: async ({ connectionId, isDefault }: { connectionId: string; isDefault: boolean }) => {
      if (isDefault) {
        await supabase
          .from('oauth_connections')
          .update({ is_default: false })
          .eq('provider', 'github');
      }
      
      const { error } = await supabase
        .from('oauth_connections')
        .update({ is_default: isDefault })
        .eq('id', connectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
      toast.success('Default GitHub connection updated');
    },
    onError: (error) => {
      console.error('Error updating default connection:', error);
      toast.error('Failed to update default connection');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">GitHub Connections</h3>
          <p className="text-sm text-muted-foreground">
            Manage your connected GitHub accounts
          </p>
        </div>
        <GitHubConnectButton />
      </div>

      <ConnectionsList
        connections={connections}
        isLoading={isLoading}
        onToggleDefault={(connectionId, isDefault) => 
          toggleDefaultMutation.mutate({ connectionId, isDefault })
        }
        onDelete={(connectionId) => deleteMutation.mutate(connectionId)}
      />
    </div>
  );
}