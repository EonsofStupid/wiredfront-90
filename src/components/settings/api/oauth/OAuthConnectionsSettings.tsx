import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionButton } from "./ConnectionButton";
import { ConnectionsList } from "./ConnectionList";
import { useConnectionActions } from "./useConnectionActions";

export function OAuthConnectionsSettings() {
  const { onConnect, onDisconnect, onToggleDefault } = useConnectionActions();

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">GitHub Connections</h3>
          <p className="text-sm text-muted-foreground">
            Manage your connected GitHub accounts
          </p>
        </div>
        <ConnectionButton
          isConnecting={false}
          onConnect={onConnect}
        />
      </div>

      <ConnectionsList
        connections={connections}
        isLoading={isLoading}
        onToggleDefault={onToggleDefault}
        onDelete={onDisconnect}
      />
    </div>
  );
}