import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Clock, Github, RefreshCw, Search, Trash, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/chat/ui/Spinner";
import { GitHubOAuthConnection, GitHubConnectionStatus } from "@/types/admin/settings/github";
import { useSessionStore } from "@/stores/session/store";

export default function GitHubConnectionsAdmin() {
  const navigate = useNavigate();
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState("connections");
  const [connections, setConnections] = useState<GitHubOAuthConnection[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase.rpc('is_super_admin', { user_id: user?.id });
        
        if (error || !data) {
          toast.error("You don't have permission to access this page");
          navigate('/');
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Failed to verify permissions");
        navigate('/');
      }
    };
    
    if (user) {
      checkAdminStatus();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        if (activeTab === "connections") {
          const { data, error } = await supabase
            .from('oauth_connections')
            .select('*')
            .eq('provider', 'github')
            .order('updated_at', { ascending: false });
            
          if (error) throw error;
          setConnections(data || []);
        } 
        else if (activeTab === "logs") {
          const { data, error } = await supabase
            .from('github_oauth_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);
            
          if (error) throw error;
          setLogs(data || []);
        } 
        else if (activeTab === "metrics") {
          const { data, error } = await supabase
            .from('github_metrics')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          setMetrics(data || []);
        }
      } catch (error) {
        console.error(`Error loading ${activeTab}:`, error);
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);

  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      if (activeTab === "connections") {
        const { data, error } = await supabase
          .from('oauth_connections')
          .select('*')
          .eq('provider', 'github')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setConnections(data || []);
      } 
      else if (activeTab === "logs") {
        const { data, error } = await supabase
          .from('github_oauth_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);
          
        if (error) throw error;
        setLogs(data || []);
      }
      else if (activeTab === "metrics") {
        const { data, error } = await supabase
          .from('github_metrics')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        setMetrics(data || []);
      }
      
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error(`Error refreshing ${activeTab}:`, error);
      toast.error(`Failed to refresh ${activeTab}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkConnectionStatus = async (userId: string) => {
    setActionInProgress(userId);
    
    try {
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'validate',
          userId
        }
      });
      
      if (error) throw error;
      
      toast.success("Connection validated successfully");
      refreshData();
    } catch (error) {
      console.error("Error validating connection:", error);
      toast.error("Failed to validate connection");
    } finally {
      setActionInProgress(null);
    }
  };

  const revokeConnection = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke this connection?")) return;
    
    setActionInProgress(userId);
    
    try {
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'revoke',
          userId 
        }
      });
      
      if (error) throw error;
      
      toast.success("Connection revoked successfully");
      refreshData();
    } catch (error) {
      console.error("Error revoking connection:", error);
      toast.error("Failed to revoke connection");
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredConnections = connections.filter(conn => 
    conn.account_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredLogs = logs.filter(log => 
    log.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.error_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.request_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMetrics = metrics.filter(metric => 
    metric.metric_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Error</Badge>;
      case 'disconnected':
        return <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" /> Disconnected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-6 w-6" />
          <h1 className="text-2xl font-bold">GitHub Connections Admin</h1>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
          Back to Admin
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>GitHub OAuth Management</CardTitle>
          <CardDescription>
            Manage GitHub connections, review logs, and monitor metrics
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="connections">User Connections</TabsTrigger>
                  <TabsTrigger value="logs">OAuth Logs</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={refreshData}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <Spinner size="sm" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <TabsContent value="connections" className="mt-4">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" label="Loading connections..." />
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No GitHub connections found
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>GitHub Account</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredConnections.map((connection) => (
                          <TableRow key={connection.id}>
                            <TableCell className="font-medium">{connection.user_id.substring(0, 8)}...</TableCell>
                            <TableCell className="flex items-center gap-2">
                              <Github className="h-4 w-4" />
                              {connection.account_username || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {connection.expires_at && new Date(connection.expires_at) < new Date() ? (
                                <Badge variant="outline" className="text-amber-500 border-amber-500">
                                  <Clock className="w-3 h-3 mr-1" /> Expired
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Active
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(connection.updated_at)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => checkConnectionStatus(connection.user_id)}
                                  disabled={actionInProgress === connection.user_id}
                                >
                                  {actionInProgress === connection.user_id ? (
                                    <Spinner size="sm" className="mr-1" />
                                  ) : (
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                  )}
                                  Validate
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => revokeConnection(connection.user_id)}
                                  disabled={actionInProgress === connection.user_id}
                                >
                                  {actionInProgress === connection.user_id ? (
                                    <Spinner size="sm" className="mr-1" />
                                  ) : (
                                    <Trash className="h-3 w-3 mr-1" />
                                  )}
                                  Revoke
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="logs" className="mt-4">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" label="Loading logs..." />
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No logs found
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Event Type</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead>Trace ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{formatDate(log.timestamp)}</TableCell>
                            <TableCell className="font-medium">{log.event_type}</TableCell>
                            <TableCell>{log.user_id ? log.user_id.substring(0, 8) + '...' : '-'}</TableCell>
                            <TableCell>
                              {log.success === true ? (
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Success
                                </Badge>
                              ) : log.success === false ? (
                                <Badge variant="outline" className="text-red-500 border-red-500">
                                  <XCircle className="w-3 h-3 mr-1" /> Failed
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Clock className="w-3 h-3 mr-1" /> Info
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {log.error_message || '-'}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {log.request_id || log.metadata?.trace_id || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="metrics" className="mt-4">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" label="Loading metrics..." />
                  </div>
                ) : filteredMetrics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No metrics found
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Metric Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Metadata</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMetrics.map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{formatDate(metric.timestamp)}</TableCell>
                            <TableCell className="font-medium">{metric.metric_type}</TableCell>
                            <TableCell>{metric.value !== null ? metric.value : '-'}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {metric.metadata ? JSON.stringify(metric.metadata) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
