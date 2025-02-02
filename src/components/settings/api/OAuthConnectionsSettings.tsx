import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OAuthConnection {
  id: string;
  provider: string;
  account_username: string;
  account_type: string;
  is_default: boolean;
  scopes: string[];
  last_used: string;
}

export function OAuthConnectionsSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
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
      return data as OAuthConnection[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
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

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // Generate a random state value
      const state = crypto.randomUUID();
      // Store state in localStorage for validation
      localStorage.setItem('github_oauth_state', state);

      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: window.location.origin + '/settings',
          state
        }
      });

      if (error) throw error;
      
      if (data?.authUrl) {
        // Open popup window
        const popup = window.open(
          data.authUrl,
          'GitHub Login',
          'width=600,height=700,left=200,top=100'
        );

        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          throw new Error('Popup blocked! Please allow popups for this site.');
        }

        // Poll for popup closure
        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            setIsConnecting(false);
            // Check if connection was successful by querying connections
            queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate GitHub connection');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">GitHub Connections</h3>
          <p className="text-sm text-muted-foreground">
            Manage your connected GitHub accounts
          </p>
        </div>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          <Github className="h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect GitHub'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : connections?.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No GitHub accounts connected yet
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {connections?.map((connection) => (
            <Card key={connection.id}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      {connection.account_username}
                    </CardTitle>
                    <CardDescription>
                      Type: {connection.account_type}
                      {connection.last_used && (
                        <> · Last used: {new Date(connection.last_used).toLocaleDateString()}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Default</span>
                      <Switch
                        checked={connection.is_default}
                        onCheckedChange={(checked) => 
                          toggleDefaultMutation.mutate({ 
                            connectionId: connection.id, 
                            isDefault: checked 
                          })
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(connection.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
