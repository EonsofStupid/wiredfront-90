
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, FolderGit2, GitPullRequest, X, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";

export function GitHubSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(null);
        toast.success('Connected to GitHub successfully');
        // Refresh connection data
        checkGitHubConnection();
      } else if (event.data && event.data.type === 'github-auth-error') {
        console.error('GitHub auth error:', event.data.error);
        setConnectionStatus('error');
        setErrorMessage(event.data.error);
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
      setErrorMessage(null);
      
      const callbackUrl = `${window.location.origin}/github-callback`;
      console.log("Using callback URL:", callbackUrl);
      
      // First check if the GitHub client ID is configured
      const { data: configCheck, error: configError } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl,
          check_only: true
        }
      });
      
      if (configError || (configCheck?.error && configCheck.error.includes('not configured'))) {
        const errorMsg = configCheck?.error || configError?.message || 'GitHub client ID is not configured';
        console.error('GitHub OAuth configuration error:', errorMsg);
        setErrorMessage(errorMsg);
        setConnectionStatus('error');
        toast.error(`GitHub configuration error: ${errorMsg}`);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl
        }
      });

      if (error) {
        console.error('Error starting GitHub OAuth flow:', error);
        toast.error('Failed to start GitHub OAuth flow');
        setConnectionStatus('error');
        setErrorMessage(error.message);
        return;
      }
      
      if (!data || !data.url) {
        const errorMsg = data?.error || 'No OAuth URL returned from the server';
        console.error(errorMsg);
        toast.error('Failed to generate GitHub OAuth URL');
        setConnectionStatus('error');
        setErrorMessage(errorMsg);
        return;
      }
      
      console.log('Opening GitHub OAuth URL:', data.url);
      
      // Open GitHub auth in a popup with precise dimensions
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top},status=yes,menubar=no,toolbar=no`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        console.error('Popup was blocked or could not be opened');
        toast.error('Popup was blocked. Please allow popups for this site.');
        setConnectionStatus('error');
        setErrorMessage('Popup was blocked. Please allow popups for this site.');
        return;
      }
      
      // Start an interval to check if popup is closed
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // If connection wasn't established when popup closed
          if (connectionStatus === 'connecting') {
            setConnectionStatus('idle');
            toast.error('GitHub connection was cancelled');
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
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
        
        {errorMessage && connectionStatus === 'error' && (
          <div className="p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">GitHub Connection Error</p>
              <p className="text-sm">{errorMessage}</p>
              {errorMessage.includes('not configured') && (
                <p className="text-sm mt-2">
                  Make sure the GitHub client ID and secret are configured in your Supabase Edge Function secrets.
                </p>
              )}
            </div>
          </div>
        )}
        
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
