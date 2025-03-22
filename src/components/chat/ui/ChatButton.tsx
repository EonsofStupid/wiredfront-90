import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ChatButtonProps {
  position: { x: number; y: number };
  scale: number;
  onClick: () => void;
  isPreview?: boolean;
}

export function ChatButton({ position, scale, onClick, isPreview = false }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed rounded-full p-4 shadow-lg transition-all duration-200",
        isPreview && "pointer-events-none"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${scale})`,
      }}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
