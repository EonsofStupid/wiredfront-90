
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useViewportAwareness } from '../../hooks/useViewportAwareness';
import { useChatStore } from '../../store/chatStore';
import { containerStyles } from '../../styles';

interface ChatContainerProps {
  children?: React.ReactNode;
  className?: string;
  dockPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export function ChatContainer({ 
  children, 
  className, 
  dockPosition = 'bottom-right' 
}: ChatContainerProps) {
  const { position, scale, isMinimized, docked, setPosition } = useChatStore();
  const { containerRef, isOverflowing } = useViewportAwareness();
  const [isDocked, setIsDocked] = useState(docked);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-container',
    disabled: isDocked
  });

  // Calculate position based on docking status and position
  useEffect(() => {
    if (docked) {
      setIsDocked(true);
      
      // Set position based on dock location
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const newPosition = { x: 0, y: 0 };
      
      switch (dockPosition) {
        case 'bottom-right':
          newPosition.x = viewportWidth - 420;
          newPosition.y = viewportHeight - 520;
          break;
        case 'bottom-left':
          newPosition.x = 20;
          newPosition.y = viewportHeight - 520;
          break;
        case 'top-right':
          newPosition.x = viewportWidth - 420;
          newPosition.y = 20;
          break;
        case 'top-left':
          newPosition.x = 20;
          newPosition.y = 20;
          break;
      }
      
      setPosition(newPosition);
    } else {
      setIsDocked(false);
    }
  }, [docked, dockPosition, setPosition]);

  // Check if the container is at the edge of the screen
  useEffect(() => {
    if (!transform || isDocked) return;
    
    const threshold = 20; // pixels from edge
    const containerWidth = 400; // Approximate container width
    const containerHeight = 500; // Approximate container height
    
    const newX = position.x + transform.x;
    const newY = position.y + transform.y;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check if it's near an edge
    const isNearRightEdge = newX + containerWidth > viewportWidth - threshold;
    const isNearLeftEdge = newX < threshold;
    const isNearBottomEdge = newY + containerHeight > viewportHeight - threshold;
    const isNearTopEdge = newY < threshold;
    
    // Auto-snap to edges
    if (isNearRightEdge) {
      setPosition({ ...position, x: viewportWidth - containerWidth - 10 });
    } else if (isNearLeftEdge) {
      setPosition({ ...position, x: 10 });
    }
    
    if (isNearBottomEdge) {
      setPosition({ ...position, y: viewportHeight - containerHeight - 10 });
    } else if (isNearTopEdge) {
      setPosition({ ...position, y: 10 });
    }
  }, [transform, position, setPosition, isDocked]);

  const style = transform && !isDocked
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
          className={cn(
            containerStyles.container,
            isDocked && containerStyles.docked,
            className
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          {...(isDocked ? {} : { ...attributes, ...listeners })}
        >
          <div 
            ref={containerRef} 
            className={cn(
              containerStyles.content,
              isDocked && containerStyles.dockedContent
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
