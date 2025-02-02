import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Github, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
      // Log the disconnection attempt
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

      // Log successful disconnection
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
      toast.success('GitHub connection removed successfully', {
        icon: <XCircle className="h-4 w-4 text-destructive" />
      });
    },
    onError: (error) => {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove GitHub connection', {
        icon: <XCircle className="h-4 w-4" />
      });
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
      toast.success('Default GitHub connection updated', {
        icon: <CheckCircle className="h-4 w-4 text-success" />
      });
    },
    onError: (error) => {
      console.error('Error updating default connection:', error);
      toast.error('Failed to update default connection', {
        icon: <XCircle className="h-4 w-4" />
      });
    }
  });

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // Log connection attempt
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'connect',
          status: 'pending'
        });

      const state = crypto.randomUUID();
      localStorage.setItem('github_oauth_state', state);

      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: window.location.origin + '/settings',
          state
        }
      });

      if (error) throw error;
      
      if (data?.authUrl) {
        const popup = window.open(
          data.authUrl,
          'GitHub Login',
          'width=600,height=700,left=200,top=100'
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          throw new Error('Popup blocked! Please allow popups for this site.');
        }

        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            setIsConnecting(false);
            queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate GitHub connection', {
        icon: <XCircle className="h-4 w-4" />
      });
      
      // Log connection failure
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'connect',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
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
          className={cn(
            "flex items-center gap-2 transition-all",
            isConnecting && "animate-pulse"
          )}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Github className="h-4 w-4" />
              Connect GitHub
            </>
          )}
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
            <Card key={connection.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      {connection.account_username}
                      {connection.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>Type: {connection.account_type}</span>
                      {connection.last_used && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last used: {new Date(connection.last_used).toLocaleDateString()}
                          </span>
                        </>
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
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
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