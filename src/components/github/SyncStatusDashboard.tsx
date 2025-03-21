
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, RefreshCw, GitBranch, Check, AlertTriangle, 
  XCircle, Clock, GitMerge, GitPullRequest, Filter, ArrowDownUp
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncLog {
  id: string;
  repo_id: string;
  repo_name?: string;
  repo_owner?: string;
  sync_type: string;
  status: string;
  details: any;
  created_at: string;
}

interface GithubRepository {
  repo_name: string;
  repo_owner: string;
}

export function SyncStatusDashboard() {
  const [loading, setLoading] = useState(true);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { isConnected } = useGitHubConnection();

  useEffect(() => {
    if (isConnected) {
      fetchSyncLogs();
    }
  }, [isConnected]);

  const fetchSyncLogs = async () => {
    setLoading(true);
    try {
      // First, get all repositories for easier joining
      const { data: repoData, error: repoError } = await supabase
        .from('github_repositories' as any)
        .select('id, repo_name, repo_owner');
      
      if (repoError) throw repoError;
      
      const repoMap = new Map<string, GithubRepository>();
      if (repoData) {
        repoData.forEach((repo: any) => {
          repoMap.set(repo.id, { 
            repo_name: repo.repo_name, 
            repo_owner: repo.repo_owner 
          });
        });
      }

      // Now fetch sync logs
      const { data: logsData, error: logsError } = await supabase
        .from('github_sync_logs' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Transform the data manually to include repo name and owner
      const transformedData = logsData.map((log: any) => {
        const repo = repoMap.get(log.repo_id);
        return {
          id: log.id,
          repo_id: log.repo_id,
          repo_name: repo?.repo_name || 'Unknown',
          repo_owner: repo?.repo_owner || 'Unknown',
          sync_type: log.sync_type,
          status: log.status,
          details: log.details,
          created_at: log.created_at
        };
      });

      setSyncLogs(transformedData);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      toast.error("Failed to load sync history");
    } finally {
      setLoading(false);
    }
  };

  const filterSyncLogs = (logs: SyncLog[]) => {
    if (activeFilter === "all") return logs;
    return logs.filter(log => log.status === activeFilter);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "failure":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "conflict":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSyncTypeIcon = (type: string) => {
    switch (type) {
      case "push":
        return <GitBranch className="h-4 w-4 text-neon-blue" />;
      case "pull":
        return <GitPullRequest className="h-4 w-4 text-neon-pink" />;
      case "webhook":
        return <GitMerge className="h-4 w-4 text-green-500" />;
      default:
        return <GitBranch className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
          <CardDescription>View your GitHub synchronization history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Not Connected to GitHub</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You need to connect your GitHub account first to see sync history.
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
          <CardTitle>Sync Status</CardTitle>
          <CardDescription>View your GitHub synchronization history</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSyncLogs}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Successful</TabsTrigger>
              <TabsTrigger value="failure">Failed</TabsTrigger>
              <TabsTrigger value="conflict">Conflicts</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Filter className="h-3 w-3 mr-1" />
            <span>Showing {filterSyncLogs(syncLogs).length} of {syncLogs.length} records</span>
          </div>
        </div>
        
        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : syncLogs.length === 0 ? (
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Sync History</h3>
            <p className="text-muted-foreground mb-6">
              Start syncing your repositories to see history here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filterSyncLogs(syncLogs).map((log) => (
              <div 
                key={log.id} 
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors flex items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="font-medium">{log.repo_owner}/{log.repo_name}</span>
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="h-5 px-1 font-normal">
                        {getSyncTypeIcon(log.sync_type)}
                        <span className="ml-1 capitalize">{log.sync_type}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'PPp')} • {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </div>
                  
                  {log.details?.message && (
                    <div className="mt-2 text-xs bg-muted/50 p-2 rounded">
                      {log.details.message}
                    </div>
                  )}
                </div>
                
                <div>
                  {log.status === "success" && <Badge className="bg-green-500">Success</Badge>}
                  {log.status === "failure" && <Badge className="bg-red-500">Failed</Badge>}
                  {log.status === "conflict" && <Badge className="bg-amber-500">Conflict</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
