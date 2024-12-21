import { SignalHigh, CloudOff, Loader2 } from 'lucide-react';
import { ConnectionState } from '@/types/websocket';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  state: ConnectionState;
  className?: string;
}

export const ConnectionStatus = ({ state, className }: ConnectionStatusProps) => {
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
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
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