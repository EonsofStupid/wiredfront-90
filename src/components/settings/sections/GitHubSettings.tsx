import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, FolderGit2, GitPullRequest, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";

export function GitHubSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  useEffect(() => {
    async function checkGitHubConnection() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('oauth_connections')
          .select('*')
          .eq('provider', 'github')
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error checking GitHub connection:', error);
          }
          setIsConnected(false);
          return;
        }
        
        const connection = data as GitHubOAuthConnection;
        setIsConnected(!!connection);
        if (connection && connection.account_username) {
          setUsername(connection.account_username);
        }
      } catch (error) {
        console.error('Error checking GitHub connection:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkGitHubConnection();
  }, []);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'github-auth-success') {
        console.log('GitHub auth success message received:', event.data);
        setConnectionStatus('connected');
        setUsername(event.data.username);
        setIsConnected(true);
        toast.success('Connected to GitHub successfully');
        // Refresh connection data
        checkGitHubConnection();
      } else if (event.data && event.data.type === 'github-auth-error') {
        console.error('GitHub auth error:', event.data.error);
        setConnectionStatus('error');
        toast.error(`GitHub connection failed: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const checkGitHubConnection = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'github')
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error checking GitHub connection:', error);
        }
        setIsConnected(false);
        return;
      }
      
      const connection = data as GitHubOAuthConnection;
      setIsConnected(!!connection);
      if (connection && connection.account_username) {
        setUsername(connection.account_username);
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubConnect = async () => {
    try {
      setConnectionStatus('connecting');
      
      const callbackUrl = `${window.location.origin}/github-callback`;
      
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl
        }
      });

      if (error) {
        console.error('Error starting GitHub OAuth flow:', error);
        toast.error('Failed to start GitHub OAuth flow');
        setConnectionStatus('error');
        return;
      }
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup) {
        console.error('Popup was blocked');
        toast.error('Popup was blocked. Please allow popups for this site.');
        setConnectionStatus('error');
        return;
      }
      
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setConnectionStatus('error');
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('provider', 'github');
        
      if (error) throw error;
      
      setIsConnected(false);
      setUsername(null);
      toast.success('Disconnected from GitHub');
    } catch (error) {
      console.error('Error disconnecting from GitHub:', error);
      toast.error('Failed to disconnect from GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>Connect your GitHub account to access repositories and collaborate on code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Github className="h-8 w-8" />
            <div>
              <h3 className="font-medium">GitHub</h3>
              {isConnected && username ? (
                <p className="text-sm text-muted-foreground">Connected as @{username}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleGitHubConnect}
                disabled={loading || connectionStatus === 'connecting'}
                className="border-primary/20 hover:border-primary"
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    Connect GitHub
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              className="justify-start"
              disabled={!isConnected}
            >
              <FolderGit2 className="mr-2 h-4 w-4" />
              Browse Repositories
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              disabled={!isConnected}
            >
              <GitPullRequest className="mr-2 h-4 w-4" />
              View Pull Requests
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
