import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, List } from "lucide-react";
import { CacheMetricsPanel } from "./CacheMetricsPanel";
import { useWebSocketStore } from "@/stores/websocket/store";

interface AuditEvent {
  timestamp: string;
  event: string;
  details: any;
}

export const MetricsAndAuditTabs = () => {
  const [hasNewMetrics, setHasNewMetrics] = useState(false);
  const [hasNewAudit, setHasNewAudit] = useState(false);
  const [activeTab, setActiveTab] = useState("metrics");
  const metrics = useWebSocketStore((state) => state.metrics);
  const messageHistory = useWebSocketStore((state) => state.messageHistory);

  useEffect(() => {
    if (activeTab !== "metrics") {
      setHasNewMetrics(true);
    }
  }, [metrics]);

  useEffect(() => {
    if (activeTab !== "audit") {
      setHasNewAudit(true);
    }
  }, [messageHistory]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "metrics") {
      setHasNewMetrics(false);
    } else if (value === "audit") {
      setHasNewAudit(false);
    }
  };

  return (
    <Tabs defaultValue="metrics" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="metrics" className="relative">
          <Database className="w-4 h-4 mr-2" />
          Metrics
          {hasNewMetrics && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 bg-neon-blue animate-pulse"
            >
              New
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="audit" className="relative">
          <List className="w-4 h-4 mr-2" />
          Audit Trail
          {hasNewAudit && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 bg-neon-pink animate-pulse"
            >
              New
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="metrics" className="mt-4">
        <CacheMetricsPanel />
      </TabsContent>
      <TabsContent value="audit" className="mt-4">
        <div className="space-y-4">
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {messageHistory.map((message, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-neon-blue">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  <span className="text-neon-pink">{message.type}</span>
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
                {message.metadata && Object.keys(message.metadata).length > 0 && (
                  <pre className="mt-2 text-xs bg-muted p-2 rounded">
                    {JSON.stringify(message.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};