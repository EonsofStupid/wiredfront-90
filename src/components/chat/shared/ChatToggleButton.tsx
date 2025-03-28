
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        size="lg"
        onClick={onClick}
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        aria-label="Open chat"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};
