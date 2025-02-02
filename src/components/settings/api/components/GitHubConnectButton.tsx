import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function GitHubConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
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
      toast.error(error instanceof Error ? error.message : 'Failed to initiate GitHub connection');
      
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
  );
}