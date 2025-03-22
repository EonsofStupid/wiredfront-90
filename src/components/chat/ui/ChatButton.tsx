
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ChatButtonProps {
  position: { x: number; y: number };
  scale: number;
  onClick: () => void;
  isPreview?: boolean;
}

export function ChatButton({ position, scale, onClick, isPreview = false }: ChatButtonProps) {
  const positionClass = position?.x > window.innerWidth / 2
    ? 'right-4'
    : 'left-4';

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "chat-toggle-button fixed z-50",
        "bg-gradient-to-r from-purple-600 to-purple-800",
        "text-white p-3 rounded-full",
        "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        "border border-purple-500/50",
        "backdrop-blur-md",
        isPreview && "pointer-events-none",
        positionClass
      )}
      style={{
        bottom: isPreview ? 'auto' : 16,
        right: isPreview ? 'auto' : position?.x || 16,
        transform: `scale(${scale})`,
        transformOrigin: 'bottom right',
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px rgba(168,85,247,0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open chat"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <MessageSquare className="h-6 w-6" />
    </motion.button>
  );
}
