import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';

interface MetricsData {
  connectionState: ConnectionState;
  messagesSent: number;
  messagesReceived: number;
  errors: Array<{ timestamp: number; error: string }>;
  latency: number;
  uptime: number;
  reconnectAttempts: number;
}

export const DebugMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [activeTab, setActiveTab] = useState('metrics');
  const [hasNewInfo, setHasNewInfo] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const logger = WebSocketLogger.getInstance();
      const currentMetrics = logger.getMetrics();
      const newMetrics: MetricsData = {
        connectionState: logger.getConnectionState(),
        messagesSent: currentMetrics.messagesSent,
        messagesReceived: currentMetrics.messagesReceived,
        errors: logger.getLogs()
          .filter(log => log.level === 'error')
          .map(log => ({
            timestamp: log.timestamp,
            error: log.message
          })),
        latency: currentMetrics.latency,
        uptime: currentMetrics.uptime,
        reconnectAttempts: currentMetrics.reconnectAttempts
      };
      setMetrics(newMetrics);
      setHasNewInfo(true);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'metrics' || value === 'audit') {
      setHasNewInfo(false);
    }
  };

  if (!metrics) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-96 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="metrics" className={hasNewInfo ? 'text-neon-blue animate-pulse' : ''}>
            Metrics
          </TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Connection State</span>
              <Badge variant={metrics.connectionState === 'connected' ? 'default' : 'destructive'}>
                {metrics.connectionState}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Messages Sent</span>
              <Badge variant="secondary">{metrics.messagesSent}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Messages Received</span>
              <Badge variant="secondary">{metrics.messagesReceived}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Latency</span>
              <Badge variant="secondary">{metrics.latency}ms</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Uptime</span>
              <Badge variant="secondary">{Math.floor(metrics.uptime / 1000)}s</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Reconnect Attempts</span>
              <Badge variant="secondary">{metrics.reconnectAttempts}</Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="p-4">
          <ScrollArea className="h-[300px]">
            {metrics.errors.map((error, index) => (
              <div key={index} className="mb-2 p-2 rounded bg-destructive/10 text-destructive">
                <div className="text-xs font-mono">{new Date(error.timestamp).toLocaleTimeString()}</div>
                <div className="text-sm">{error.error}</div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="logs" className="p-4">
          <ScrollArea className="h-[300px]">
            {WebSocketLogger.getInstance().getLogs().map((log, index) => (
              <div key={index} className="mb-2 text-xs">
                <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="ml-2">{log.message}</span>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};