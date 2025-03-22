
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ChatButtonProps {
  position: { x: number; y: number };
  scale: number;
  onClick: () => void;
}

export function ChatButton({ position, scale, onClick }: ChatButtonProps) {
  return (
    <button
      className={cn(
        "fixed z-50 rounded-full p-4",
        "bg-purple-600 text-white shadow-lg",
        "hover:bg-purple-700 transition-colors",
        "animate-in fade-in duration-500"
      )}
      style={{ 
        bottom: '1rem', 
        right: '1rem', 
        transform: `scale(${scale})` 
      }}
      onClick={onClick}
      aria-label="Open chat"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
}
