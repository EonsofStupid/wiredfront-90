import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messageCache } from '@/services/chat/MessageCacheService';
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';

interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  syncAttempts: number;
  syncSuccesses: number;
  errors: Array<{ timestamp: number; error: string }>;
}

export const CacheMetricsPanel = () => {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    setIsRefreshing(true);
    try {
      const currentMetrics = await messageCache.getMetrics();
      setMetrics(currentMetrics as CacheMetrics);
    } catch (error) {
      console.error('Failed to fetch cache metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg border-muted">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Cache Metrics Debug Panel</h3>
          <RefreshCw 
            className={`h-4 w-4 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={fetchMetrics}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Cache Hits</span>
            <Badge variant="secondary">{metrics.cacheHits}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Cache Misses</span>
            <Badge variant="secondary">{metrics.cacheMisses}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Sync Attempts</span>
            <Badge variant="secondary">{metrics.syncAttempts}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Sync Successes</span>
            <Badge variant="secondary">{metrics.syncSuccesses}</Badge>
          </div>
        </div>

        {metrics.errors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2">Recent Errors</h4>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {metrics.errors.map((error, index) => (
                  <div key={index} className="text-xs p-2 rounded bg-destructive/10 text-destructive">
                    <div className="font-mono">{new Date(error.timestamp).toLocaleTimeString()}</div>
                    <div>{error.error}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
};