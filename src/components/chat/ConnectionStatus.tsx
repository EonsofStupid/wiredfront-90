import { SignalHigh, CloudOff, Loader2, AlertTriangle } from 'lucide-react';
import { ConnectionState } from '@/types/websocket';
import { cn } from '@/lib/utils';
import { useWebSocketStore } from '@/stores/websocket/store';

interface ConnectionStatusProps {
  className?: string;
  state: ConnectionState;
}

export const ConnectionStatus = ({ className, state }: ConnectionStatusProps) => {
  const errorCount = useWebSocketStore((state) => state.errors.errorCount);

  const getIcon = () => {
    switch (state) {
      case 'connected':
        return <SignalHigh className="w-4 h-4 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
      case 'error':
        return <CloudOff className="w-4 h-4 text-red-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return `Reconnecting... (Attempt ${errorCount})`;
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      case 'failed':
        return 'Connection Failed';
      default:
        return '';
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-1", className)} 
      title={getTitle()}
    >
      {getIcon()}
      <span className="text-xs text-muted-foreground">{getTitle()}</span>
    </div>
  );
};