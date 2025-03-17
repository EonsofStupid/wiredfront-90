import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteLoggingService, NavigationLog } from "@/services/navigation/RouteLoggingService";
import { formatDistanceToNow } from "date-fns";
import { Loader2, RotateCcw, Download, Filter } from "lucide-react";

export function NavigationLogsPanel() {
  const [logs, setLogs] = useState<NavigationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'user'>('all');
  
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const navigationLogs = await RouteLoggingService.getNavigationLogs(50, view === 'all');
      setLogs(navigationLogs);
    } catch (err: any) {
      setError(err.message || 'Failed to load navigation logs');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, [view]);
  
  const downloadLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `navigation-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Navigation Logs</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadLogs}
            disabled={isLoading || logs.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="ml-2">Export</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as 'all' | 'user')}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="user">Current User</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="flex items-center">
              <Filter className="h-3 w-3 mr-1" />
              {logs.length} Logs
            </Badge>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <NavigationLogsList logs={logs} isLoading={isLoading} error={error} />
          </TabsContent>
          
          <TabsContent value="user" className="mt-0">
            <NavigationLogsList logs={logs} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface NavigationLogsListProps {
  logs: NavigationLog[];
  isLoading: boolean;
  error: string | null;
}

function NavigationLogsList({ logs, isLoading, error }: NavigationLogsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 p-4 border border-red-200 rounded">
        {error}
      </div>
    );
  }
  
  if (logs.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No navigation logs found
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="p-3 border rounded-md hover:bg-accent/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{log.message}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(log.metadata.previousRoute || log.metadata.from) && (
                    <Badge variant="outline" className="text-xs">
                      From: {log.metadata.previousRoute || log.metadata.from}
                    </Badge>
                  )}
                  {(log.metadata.currentRoute || log.metadata.to) && (
                    <Badge variant="secondary" className="text-xs">
                      To: {log.metadata.currentRoute || log.metadata.to}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {log.timestamp && formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </div>
            </div>
            {log.user_id && (
              <div className="mt-2 text-xs text-muted-foreground">
                User ID: {log.user_id}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
