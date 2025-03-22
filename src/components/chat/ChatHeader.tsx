import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, MoveRight, Pin, PinOff, X, Zap } from "lucide-react";
import { StatusButton } from "./features/status-button/StatusButton";

interface ChatHeaderProps {
  onPositionToggle: () => void;
}

export function ChatHeader({ onPositionToggle }: ChatHeaderProps) {
  const {
    isMinimized,
    docked,
    toggleMinimize,
    toggleOpen,
    toggleDocked
  } = useChat();

  return (
    <div className={cn(
      "chat-header h-12 px-3 flex items-center justify-between",
      "bg-black/80 backdrop-blur-md border-b border-purple-500/50",
      "shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    )}>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-white/90">AI Assistant</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <StatusButton />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "chat-control-button h-8 w-8",
              "hover:bg-white/10 hover:text-purple-400",
              "transition-colors duration-200"
            )}
            onClick={onPositionToggle}
            aria-label="Toggle chat position"
          >
            <MoveRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "chat-control-button h-8 w-8",
              "hover:bg-white/10 hover:text-purple-400",
              "transition-colors duration-200"
            )}
            onClick={toggleDocked}
            aria-label={docked ? "Undock chat" : "Dock chat"}
          >
            {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "chat-control-button h-8 w-8",
              "hover:bg-white/10 hover:text-purple-400",
              "transition-colors duration-200"
            )}
            onClick={toggleMinimize}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "chat-control-button h-8 w-8",
              "hover:bg-red-400/10 hover:text-red-400",
              "transition-colors duration-200"
            )}
            onClick={toggleOpen}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
