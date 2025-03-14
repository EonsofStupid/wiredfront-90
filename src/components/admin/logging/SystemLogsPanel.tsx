
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  ArrowDownUp, 
  Bug, 
  Download, 
  FileText, 
  GitBranch, 
  Info, 
  Loader2, 
  RotateCcw, 
  Search,
  Trash
} from "lucide-react";
import { format } from "date-fns";

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  source: string;
  message: string;
  metadata: Record<string, any> | null;
  user_id: string | null;
}

export function SystemLogsPanel() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('system_logs')
        .select('*');
      
      // Sort by timestamp
      query = query.order('timestamp', { ascending: sortDirection === 'asc' });
      
      // Limit to the most recent 250 logs
      query = query.limit(250);
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setLogs(data as SystemLog[]);
        
        // Extract unique sources for the filter
        const sources = [...new Set(data.map(log => log.source))];
        setUniqueSources(sources);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch system logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...logs];
    
    // Filter by log level
    if (activeTab !== "all") {
      filtered = filtered.filter(log => log.level === activeTab);
    }
    
    // Filter by source
    if (sourceFilter) {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) || 
        (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query))
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, activeTab, sourceFilter, searchQuery]);
  
  // Fetch logs on initial load and when sort changes
  useEffect(() => {
    fetchLogs();
  }, [sortDirection]);
  
  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to delete ALL system logs? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you might want to make this more selective,
      // like only clearing logs older than a certain date
      const { error: deleteError } = await supabase
        .from('system_logs')
        .delete()
        .not('id', 'is', null); // Dummy condition to delete all
      
      if (deleteError) throw deleteError;
      
      setLogs([]);
      setFilteredLogs([]);
    } catch (err) {
      console.error("Error clearing logs:", err);
      setError("Failed to clear logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadLogs = () => {
    const logData = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'debug': return <Bug className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  const getSourceIcon = (source: string) => {
    if (source.includes('github')) return <GitBranch className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const toggleExpandLog = (id: string) => {
    if (expandedLogId === id) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(id);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return timestamp;
    }
  };
  
  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'info': return 'default';
      case 'error': return 'destructive';
      case 'warn': return 'warning';
      case 'debug': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          System Logs
        </CardTitle>
        <CardDescription>
          View and manage system logs from across the application
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={sourceFilter || ""} onValueChange={(value) => setSourceFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
                title={`Sort ${sortDirection === 'desc' ? 'oldest first' : 'newest first'}`}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={fetchLogs}
                disabled={isLoading}
                title="Refresh logs"
              >
                <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={downloadLogs}
                disabled={filteredLogs.length === 0 || isLoading}
                title="Download logs"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                onClick={handleClearLogs}
                disabled={logs.length === 0 || isLoading}
                title="Clear all logs"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="warn">Warnings</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading logs...</p>
                </div>
              ) : error ? (
                <div className="p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Error Loading Logs</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No logs found</h3>
                  <p className="text-sm text-muted-foreground">
                    {logs.length === 0 
                      ? "No system logs have been recorded yet" 
                      : "No logs match your current filters"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Level</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Source</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredLogs.map((log) => (
                          <tr 
                            key={log.id} 
                            className={`hover:bg-muted/50 ${expandedLogId === log.id ? 'bg-muted/30' : ''}`}
                            onClick={() => toggleExpandLog(log.id)}
                          >
                            <td className="px-4 py-2 text-xs whitespace-nowrap">
                              {formatTimestamp(log.timestamp)}
                            </td>
                            <td className="px-4 py-2">
                              <Badge variant={getLevelBadgeVariant(log.level)} className="flex gap-1 items-center">
                                {getLogIcon(log.level)}
                                <span className="capitalize text-xs">{log.level}</span>
                              </Badge>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-1">
                                {getSourceIcon(log.source)}
                                <span className="text-xs">{log.source}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-xs">
                              <div className="max-w-md truncate">{log.message}</div>
                              
                              {expandedLogId === log.id && log.metadata && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto">
                                  <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
