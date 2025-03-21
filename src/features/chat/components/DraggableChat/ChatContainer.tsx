import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useViewportAwareness } from '../../hooks/useViewportAwareness';
import { useChatStore } from '../../store/chatStore';
import { containerStyles } from '../../styles';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatContainer({ children, className }: ChatContainerProps) {
  const { position, scale, isMinimized } = useChatStore();
  const { containerRef, isOverflowing } = useViewportAwareness();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-container',
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})`,
      }
    : {
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
      };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          ref={setNodeRef}
          style={style}
          className={cn(containerStyles.container, className)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          {...attributes}
          {...listeners}
        >
          <div ref={containerRef} className={containerStyles.content}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
