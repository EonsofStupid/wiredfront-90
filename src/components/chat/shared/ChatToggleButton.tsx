
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-[var(--z-chat)]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onClick}
        className="h-12 w-12 rounded-full shadow-md shadow-primary/20"
        data-testid="chat-toggle-button"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}
