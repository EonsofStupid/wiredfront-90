
import { cn } from "@/lib/utils";
import { ChatPosition } from "@/types/chat";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ChatButtonProps {
  position: ChatPosition;
  scale: number;
  onClick: () => void;
  isPreview?: boolean;
}

export function ChatButton({ position, scale, onClick, isPreview = false }: ChatButtonProps) {
  return (
    <motion.button
      className={cn(
        "rounded-full w-12 h-12 bg-purple-600 text-white shadow-lg",
        "flex items-center justify-center",
        "transition-colors duration-300 hover:bg-purple-700",
        "fixed z-50 bottom-4 right-4",
        "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        isPreview && "pointer-events-none relative bottom-0 right-0"
      )}
      style={{
        right: isPreview ? 0 : position.x > window.innerWidth / 2 ? '1rem' : 'auto',
        left: isPreview ? 0 : position.x <= window.innerWidth / 2 ? '1rem' : 'auto',
        bottom: '1rem',
        transform: `scale(${scale})`,
      }}
      whileHover={{ scale: scale * 1.1 }}
      whileTap={{ scale: scale * 0.95 }}
      onClick={isPreview ? undefined : onClick}
    >
      <MessageSquare className="h-6 w-6" />
    </motion.button>
  );
}

export default ChatButton;
