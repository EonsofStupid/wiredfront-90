
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Github, RefreshCw, LinkIcon, Clock, GitBranch, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Repository {
  id: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  sync_status: string;
  last_synced_at: string | null;
  auto_sync: boolean;
  created_at: string;
}

export function RepositoryManagement() {
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [syncingRepo, setSyncingRepo] = useState<string | null>(null);
  const { isConnected, linkedAccounts } = useGitHubConnection();

  useEffect(() => {
    if (isConnected) {
      fetchRepositories();
    }
  }, [isConnected]);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("github_repositories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRepositories(data || []);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  const syncRepository = async (repoId: string) => {
    setSyncingRepo(repoId);
    try {
      const { error } = await supabase.functions.invoke("github-repo-management", {
        body: {
          action: "sync-repo",
          repoId
        }
      });

      if (error) throw error;
      
      toast.success("Repository sync initiated");
      
      // Refresh the repository list after a short delay
      setTimeout(() => {
        fetchRepositories();
      }, 1000);
    } catch (error) {
      console.error("Error syncing repository:", error);
      toast.error("Failed to sync repository");
    } finally {
      setSyncingRepo(null);
    }
  };

  const toggleAutoSync = async (repoId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("github_repositories")
        .update({ auto_sync: !currentValue })
        .eq("id", repoId);

      if (error) throw error;
      
      // Update the local state
      setRepositories(repos => 
        repos.map(repo => 
          repo.id === repoId ? { ...repo, auto_sync: !currentValue } : repo
        )
      );
      
      toast.success(`Auto-sync ${!currentValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error toggling auto-sync:", error);
      toast.error("Failed to update auto-sync setting");
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Synced</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "syncing":
        return <Badge className="bg-blue-500">Syncing</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Repositories</CardTitle>
          <CardDescription>
            Connect to GitHub to manage your repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Not Connected to GitHub</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You need to connect your GitHub account first to manage repositories.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>GitHub Repositories</CardTitle>
          <CardDescription>
            Manage your connected GitHub repositories
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRepositories}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Repositories</TabsTrigger>
            <TabsTrigger value="autosync">Auto-Sync Enabled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : repositories.length === 0 ? (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Repositories Found</h3>
                <p className="text-muted-foreground mb-6">
                  Import a GitHub repository to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {repositories.map((repo) => (
                  <div 
                    key={repo.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-neon-blue" />
                          <a 
                            href={repo.repo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:text-neon-blue transition-colors flex items-center gap-1"
                          >
                            {repo.repo_owner}/{repo.repo_name}
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {getSyncStatusBadge(repo.sync_status)}
                          
                          {repo.last_synced_at && (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last synced {formatDistanceToNow(new Date(repo.last_synced_at), { addSuffix: true })}
                            </span>
                          )}
                          
                          {repo.auto_sync && (
                            <Badge variant="outline" className="border-neon-blue text-neon-blue">
                              Auto-sync
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAutoSync(repo.id, repo.auto_sync)}
                        >
                          {repo.auto_sync ? 'Disable Auto-sync' : 'Enable Auto-sync'}
                        </Button>
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => syncRepository(repo.id)}
                          disabled={syncingRepo === repo.id}
                          className="bg-neon-blue hover:bg-neon-blue/80"
                        >
                          {syncingRepo === repo.id ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Sync Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="autosync">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : repositories.filter(r => r.auto_sync).length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Auto-Sync Repositories</h3>
                <p className="text-muted-foreground mb-6">
                  Enable auto-sync for your repositories to keep them updated automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {repositories.filter(r => r.auto_sync).map((repo) => (
                  <div 
                    key={repo.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-neon-blue" />
                          <a 
                            href={repo.repo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:text-neon-blue transition-colors flex items-center gap-1"
                          >
                            {repo.repo_owner}/{repo.repo_name}
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {getSyncStatusBadge(repo.sync_status)}
                          
                          {repo.last_synced_at && (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last synced {formatDistanceToNow(new Date(repo.last_synced_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAutoSync(repo.id, repo.auto_sync)}
                        >
                          Disable Auto-sync
                        </Button>
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => syncRepository(repo.id)}
                          disabled={syncingRepo === repo.id}
                          className="bg-neon-blue hover:bg-neon-blue/80"
                        >
                          {syncingRepo === repo.id ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Sync Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
