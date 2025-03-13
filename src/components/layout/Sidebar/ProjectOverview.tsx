import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { Plus, Folder, Github, Import, ExternalLink, Info, Code, X, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProjectOverviewProps {
  className?: string;
  isCompact: boolean;
}

export const ProjectOverview = ({ className }: ProjectOverviewProps) => {
  const { 
    project: { projects, activeProjectId },
    setActiveProject, 
    addProject 
  } = useUIStore();
  
  const [isGithubConnected, setIsGithubConnected] = useState<boolean>(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const checkGitHubConnection = useCallback(async () => {
    try {
      setIsCheckingConnection(true);
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'github')
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error checking GitHub connection:', error);
        }
        setIsGithubConnected(false);
        return;
      }
      
      const connection = data as GitHubOAuthConnection;
      setIsGithubConnected(!!connection);
      if (connection && connection.account_username) {
        setGithubUsername(connection.account_username);
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setIsCheckingConnection(false);
    }
  }, []);

  useEffect(() => {
    checkGitHubConnection();
  }, [checkGitHubConnection]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      console.log('Message received from popup:', event.data);
      
      if (event.data && event.data.type === 'github-auth-success') {
        console.log('GitHub auth success message received:', event.data);
        setConnectionStatus('connected');
        
        // Update GitHub connection status in the database and local state
        // This will be handled by the github-oauth-callback edge function
        // which saves the token to the database
        toast.success('Connected to GitHub successfully');
        checkGitHubConnection(); // Refresh connection data
      } else if (event.data && event.data.type === 'github-auth-error') {
        console.error('GitHub auth error:', event.data.error);
        setConnectionStatus('error');
        toast.error(`GitHub connection failed: ${event.data.error}`);
        setIsConnectDialogOpen(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const handleGitHubConnect = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Prepare the callback URL (current origin)
      const callbackUrl = `${window.location.origin}/github-callback`;
      console.log("Using callback URL:", callbackUrl);
      
      // Call the GitHub OAuth initialization edge function
      const response = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl
        }
      });

      console.log('GitHub OAuth init response:', response);
      
      if (response.error) {
        console.error('Error starting GitHub OAuth flow:', response.error);
        toast.error(`Failed to start GitHub OAuth flow: ${response.error.message}`);
        setConnectionStatus('error');
        return;
      }
      
      const { data } = response;
      
      // Log the URL to help with debugging
      console.log('GitHub OAuth URL generated:', data?.url);
      
      if (!data || !data.url) {
        console.error('No OAuth URL returned from the server');
        toast.error('Failed to generate GitHub OAuth URL');
        setConnectionStatus('error');
        return;
      }

      // Open GitHub auth in a popup with precise dimensions
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      console.log('Opening popup with URL:', data.url);
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top},status=yes,menubar=no,toolbar=no`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        console.error('Popup was blocked or could not be opened');
        toast.error('Popup was blocked. Please allow popups for this site.');
        setConnectionStatus('error');
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
      setIsConnectDialogOpen(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsCheckingConnection(true);
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('provider', 'github');
        
      if (error) throw error;
      
      setIsGithubConnected(false);
      setGithubUsername(null);
      toast.success('Disconnected from GitHub');
    } catch (error) {
      console.error('Error disconnecting from GitHub:', error);
      toast.error('Failed to disconnect from GitHub');
    } finally {
      setIsCheckingConnection(false);
    }
  };
  
  const handleAddProject = () => {
    addProject({
      name: `New Project ${projects.length + 1}`,
      description: "Add a description",
      lastModified: new Date(),
    });
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-neon-blue/20">
        <h2 className="text-neon-blue font-medium text-xl">Project Hub</h2>
      </div>
      
      <div className="p-4 border-b border-neon-blue/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-neon-pink" />
            <h3 className="font-medium">GitHub</h3>
          </div>
          
          {isCheckingConnection ? (
            <div className="animate-pulse flex items-center">
              <RefreshCw className="h-4 w-4 mr-1.5 animate-spin text-gray-400" />
              <span className="text-xs text-gray-400">Checking...</span>
            </div>
          ) : isGithubConnected ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400">
              <Check className="h-3 w-3 mr-1" /> Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/20 text-red-400">
              <X className="h-3 w-3 mr-1" /> Disconnected
            </span>
          )}
        </div>
        
        {isGithubConnected && githubUsername ? (
          <div className="mt-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Connected as <span className="text-neon-blue">@{githubUsername}</span>
            </p>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-1.5 text-destructive hover:bg-destructive/10"
              onClick={handleDisconnect}
              disabled={isCheckingConnection}
            >
              {isCheckingConnection ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-auto py-2 border-primary/20 hover:border-primary"
              onClick={() => setIsConnectDialogOpen(true)}
              disabled={connectionStatus === 'connecting' || isCheckingConnection}
            >
              {connectionStatus === 'connecting' || isCheckingConnection ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isCheckingConnection ? 'Checking...' : 'Connecting...'}
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  Connect GitHub
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {activeProject ? (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">{activeProject.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated {formatDistanceToNow(new Date(activeProject.lastModified), { addSuffix: true })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{activeProject.description || "No description provided"}</p>
            </div>
            
            {isGithubConnected && (
              <div className="space-y-2">
                <p className="text-sm font-medium">GitHub Repository</p>
                <a 
                  href={`https://github.com/${githubUsername}/${activeProject.name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neon-blue hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {`${githubUsername}/${activeProject.name}`}
                </a>
              </div>
            )}
            
            <div className="pt-2 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Code className="h-4 w-4" />
                View Code
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Info className="h-4 w-4" />
                Project Settings
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Project Selected</h3>
              <p className="text-sm text-muted-foreground">Create a new project or select one from the list below</p>
            </div>
            
            <div className="w-full space-y-2">
              <Button
                variant="default"
                className="w-full justify-start gap-2"
                onClick={handleAddProject}
              >
                <Plus className="h-4 w-4" />
                Create New Project
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Import className="h-4 w-4" />
                Import Project
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-neon-blue/20 space-y-3">
        <h3 className="text-sm font-medium">My Projects</h3>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {projects.map((project) => (
            <Button
              key={project.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 h-auto py-2 px-3",
                "text-left hover:bg-dark-lighter/30",
                activeProjectId === project.id && "bg-dark-lighter/50 text-neon-blue"
              )}
              onClick={() => setActiveProject(project.id)}
            >
              <Folder className="w-4 h-4 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <p className="truncate text-xs opacity-70">
                  {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                </p>
              </div>
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddProject}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Connect to GitHub</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Connecting to GitHub allows you to sync your projects, access repositories, and collaborate on code.
            </p>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConnectDialogOpen(false)}
                disabled={connectionStatus === 'connecting'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGitHubConnect}
                disabled={connectionStatus === 'connecting'}
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
