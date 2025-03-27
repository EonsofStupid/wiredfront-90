
import React from 'react';
import { atom, useAtom } from 'jotai';
import { MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatToggleButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}

// Create local atoms for component state
const isHoveringAtom = atom(false);

export function ChatToggleButton({ 
  onClick, 
  isOpen = false, 
  className 
}: ChatToggleButtonProps) {
  const [isHovering, setIsHovering] = useAtom(isHoveringAtom);
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn('fixed bottom-4 right-4 z-40', className)}
    >
      <Button
        size="lg"
        className={cn(
          'rounded-full p-3 h-14 w-14 shadow-md hover:shadow-lg',
          'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600',
          'flex items-center justify-center transition-all'
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          animate={{ rotate: isHovering ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageSquare className="h-6 w-6 text-white" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
}
