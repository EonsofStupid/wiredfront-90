import { Button } from "@/components/ui/button";
import { X, Minus, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionState } from "@/types/websocket";
import { ConnectionStatus } from "./ConnectionStatus";
import { DebugMenuIcon } from "../debug/DebugMenuIcon";

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
          <ConnectionStatus state={connectionState} />
        )}
        {currentAPI && (
          <span className="text-xs text-muted-foreground">
            ({currentAPI})
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {process.env.NODE_ENV === 'development' && <DebugMenuIcon />}
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