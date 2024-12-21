import { Button } from "@/components/ui/button";
import { X, Minus, Pin, PinOff, SignalHigh, CloudOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionState } from "@/types/websocket";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
  onTackToggle: () => void;
  isTacked: boolean;
  isDragging: boolean;
  dragHandleProps: any;
  currentAPI?: string;
  connectionState?: ConnectionState;
}

export const ChatHeader = ({
  onMinimize,
  onClose,
  onTackToggle,
  isTacked,
  isDragging,
  dragHandleProps,
  currentAPI,
  connectionState
}: ChatHeaderProps) => {
  const getConnectionIcon = () => {
    switch (connectionState) {
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

  const getConnectionTitle = () => {
    switch (connectionState) {
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
      className={cn(
        "flex items-center justify-between p-2 border-b border-border",
        isDragging && "cursor-grabbing"
      )}
      {...dragHandleProps}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">AI Chat</span>
        {connectionState && (
          <span className="text-xs text-muted-foreground flex items-center gap-1" title={getConnectionTitle()}>
            {getConnectionIcon()}
          </span>
        )}
        {currentAPI && (
          <span className="text-xs text-muted-foreground">
            ({currentAPI})
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={onTackToggle}
        >
          {isTacked ? (
            <PinOff className="w-4 h-4" />
          ) : (
            <Pin className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={onMinimize}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};