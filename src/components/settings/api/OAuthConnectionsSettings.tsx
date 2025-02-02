import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icons } from "@/components/ui/icons";
import { oauthProviders } from "./config/oauthProviders";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: connections, isLoading } = useQuery({
    queryKey: ['oauth-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
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
      toast.success('Connection removed successfully');
    },
    onError: (error) => {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  });

  const toggleDefaultMutation = useMutation({
    mutationFn: async ({ connectionId, isDefault }: { connectionId: string; isDefault: boolean }) => {
      const { error } = await supabase
        .from('oauth_connections')
        .update({ is_default: isDefault })
        .eq('id', connectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
      toast.success('Default connection updated');
    },
    onError: (error) => {
      console.error('Error updating default connection:', error);
      toast.error('Failed to update default connection');
    }
  });

  const handleConnect = async (providerId: string) => {
    setIsConnecting(true);
    setSelectedProvider(providerId);
    
    try {
      const provider = oauthProviders.find(p => p.id === providerId);
      if (!provider) throw new Error('Invalid provider');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Get OAuth configuration from Supabase
      const { data: providerConfig, error: configError } = await supabase.functions.invoke('get-oauth-config', {
        body: { provider: providerId }
      });

      if (configError) throw configError;

      // Build OAuth URL
      const state = crypto.randomUUID();
      sessionStorage.setItem('oauth_state', state);
      
      const params = new URLSearchParams({
        client_id: providerConfig.clientId,
        redirect_uri: `${window.location.origin}/api/oauth/callback`,
        scope: provider.scopes.join(' '),
        state,
        response_type: 'code'
      });

      // Redirect to provider's auth page
      window.location.href = `${provider.authUrl}?${params.toString()}`;
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to establish connection');
      setIsConnecting(false);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">OAuth Connections</h3>
          <p className="text-sm text-muted-foreground">
            Manage your OAuth connections for different services
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Connect New Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose a Provider</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {oauthProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleConnect(provider.id)}
                  disabled={isConnecting && selectedProvider === provider.id}
                >
                  <Icons.provider[provider.icon as keyof typeof Icons.provider] className="h-4 w-4" />
                  {isConnecting && selectedProvider === provider.id ? 
                    'Connecting...' : 
                    `Connect with ${provider.name}`
                  }
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-24 bg-muted rounded-lg animate-pulse" />
        </div>
      ) : connections?.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No OAuth connections configured yet
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
                    <CardTitle className="text-base">
                      {connection.provider} - {connection.account_username}
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
                      Remove
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