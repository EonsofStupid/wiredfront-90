import { GripVertical, Pin, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
  onTackToggle: () => void;
  isTacked: boolean;
  isDragging: boolean;
  dragHandleProps?: any;
}

export const ChatHeader = ({
  onMinimize,
  onClose,
  onTackToggle,
  isTacked,
  isDragging,
  dragHandleProps
}: ChatHeaderProps) => {
  return (
    <div
      className={`flex items-center justify-between p-2 border-b border-border ${!isTacked ? 'cursor-move' : ''}`}
      {...(!isTacked ? dragHandleProps : {})}
    >
      <GripVertical className={`h-4 w-4 text-foreground/60 ${isDragging ? 'text-[#baff0a]' : ''}`} />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onTackToggle}
        >
          <Pin className={`h-4 w-4 ${isTacked ? 'text-neon-blue' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMinimize}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};