
import React, { useState } from 'react';
import { useUIStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Github, Link, X, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { GitHubOAuthConnection } from '@/types/admin/settings/github';

interface GithubStatusProps {
  className?: string;
  isCompact: boolean;
}

export const GithubStatus = ({ className, isCompact }: GithubStatusProps) => {
  const { github, setGithubStatus } = useUIStore();
  const [connecting, setConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  // Check GitHub connection status on component mount
  React.useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('oauth_connections')
          .select('*')
          .eq('provider', 'github')
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error checking GitHub connection:', error);
          }
          setGithubStatus({ isConnected: false, username: null });
          return;
        }
        
        const connection = data as GitHubOAuthConnection;
        setGithubStatus({ 
          isConnected: true, 
          username: connection.account_username || null 
        });
      } catch (error) {
        console.error('Error checking GitHub connection:', error);
      }
    };
    
    checkGitHubConnection();
  }, [setGithubStatus]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setShowDialog(true);
      
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      // Open GitHub auth in a popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Poll for changes to detect when the user completes the GitHub auth flow
      const checkConnection = setInterval(async () => {
        if (popup && popup.closed) {
          clearInterval(checkConnection);
          
          const { data: connectionData, error: connectionError } = await supabase
            .from('oauth_connections')
            .select('*')
            .eq('provider', 'github')
            .single();
            
          if (connectionError) {
            if (connectionError.code !== 'PGRST116') {
              console.error('Error checking connection:', connectionError);
              toast.error('Failed to connect to GitHub');
            }
            setConnecting(false);
            setShowDialog(false);
            return;
          }
          
          const connection = connectionData as GitHubOAuthConnection;
          if (connection) {
            setGithubStatus({ 
              isConnected: true, 
              username: connection.account_username || null 
            });
            toast.success('Successfully connected to GitHub');
          } else {
            toast.error('GitHub connection failed');
          }
          
          setConnecting(false);
          setShowDialog(false);
        }
      }, 1000);
      
      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkConnection);
        if (connecting) {
          setConnecting(false);
          setShowDialog(false);
          toast.error('Connection timed out');
        }
      }, 120000);
      
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setConnecting(false);
      setShowDialog(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('provider', 'github');
        
      if (error) throw error;
      
      setGithubStatus({ isConnected: false, username: null });
      toast.success('Disconnected from GitHub');
    } catch (error) {
      console.error('Error disconnecting from GitHub:', error);
      toast.error('Failed to disconnect from GitHub');
    }
  };

  return (
    <div className={cn("border-b border-neon-blue/20 p-4", className)}>
      <div className="flex flex-col gap-2">
        {isCompact ? (
          <div className="flex justify-center">
            <Github 
              className={cn(
                "h-5 w-5", 
                github.isConnected ? "text-green-500" : "text-gray-500"
              )} 
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Github 
                className={cn(
                  "h-5 w-5", 
                  github.isConnected ? "text-green-500" : "text-gray-500"
                )} 
              />
              <span className="text-sm font-medium">GitHub</span>
              {github.isConnected && github.username && (
                <Badge variant="success" className="ml-auto text-xs">
                  Connected
                </Badge>
              )}
            </div>
            
            {github.isConnected && github.username ? (
              <div className="flex flex-col text-xs">
                <span>@{github.username}</span>
                {github.lastSynced && (
                  <span className="text-muted-foreground">
                    Synced {formatDistanceToNow(github.lastSynced, { addSuffix: true })}
                  </span>
                )}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleConnect}
                disabled={connecting}
                className="mt-1 text-xs h-8"
              >
                {connecting ? (
                  <>
                    <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>Connect</>
                )}
              </Button>
            )}
            
            {github.isConnected && (
              <div className="flex items-center justify-between mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-xs p-0 h-auto hover:bg-transparent hover:text-destructive"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>GitHub Authorization</DialogTitle>
          <DialogDescription>
            Please complete the authorization in the popup window.
            If no popup appeared, please check your popup blocker settings.
          </DialogDescription>
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-neon-blue border-t-transparent" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
