import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, FolderGit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function GitHubSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkGitHubConnection() {
      try {
        const { data, error } = await supabase
          .from('oauth_connections')
          .select('*')
          .eq('provider', 'github')
          .single();
          
        if (error) throw error;
        setIsConnected(!!data);
      } catch (error) {
        console.error('Error checking GitHub connection:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkGitHubConnection();
  }, []);

  const handleGitHubConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: `${window.location.origin}/settings`
        }
      });

      if (error) throw error;
      
      // Open GitHub auth in a popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>Connect and manage your GitHub account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleGitHubConnect}
          disabled={loading || isConnected}
        >
          <Github className="mr-2 h-4 w-4" />
          {isConnected ? 'Connected to GitHub' : 'Connect GitHub'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          disabled={!isConnected}
        >
          <FolderGit2 className="mr-2 h-4 w-4" />
          Select Repositories
        </Button>
      </CardContent>
    </Card>
  );
}