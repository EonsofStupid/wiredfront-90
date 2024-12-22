import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';
import { SignalHigh, CloudOff, Loader2 } from 'lucide-react';

export const ConnectionStatus = () => {
  const [state, setState] = useState<ConnectionState>('initial');

  useEffect(() => {
    const updateState = () => {
      setState(WebSocketLogger.getInstance().getConnectionState());
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (state) {
      case 'connected':
        return <SignalHigh className="w-4 h-4 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <CloudOff className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 p-2 flex items-center gap-2">
      {getIcon()}
      <Badge variant={state === 'connected' ? 'success' : 'destructive'}>
        {state}
      </Badge>
    </Card>
  );
};