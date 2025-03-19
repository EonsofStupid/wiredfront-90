import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

export function useViewportAwareness() {
  const { position, scale, setScale, docked } = useChatStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update viewport dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep chat in viewport
  useEffect(() => {
    if (!containerRef.current || !docked) return;
    
    const updatePosition = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const { width: viewportWidth, height: viewportHeight } = viewportDimensions;
      
      // Check if overflowing horizontally
      const isOverflowingX = (position.x + rect.width > viewportWidth) || 
                            (position.x < 0);
                            
      // Check if overflowing vertically
      const isOverflowingY = position.y + rect.height > viewportHeight;
      
      const currentlyOverflowing = isOverflowingX || isOverflowingY;
      
      // Only update state and log if the overflow state has changed
      if (currentlyOverflowing !== isOverflowing) {
        setIsOverflowing(currentlyOverflowing);
        
        if (currentlyOverflowing) {
          logger.info('Chat is overflowing viewport', { 
            containerWidth: rect.width,
            containerHeight: rect.height,
            viewportWidth,
            viewportHeight,
            overflowX: isOverflowingX,
            overflowY: isOverflowingY
          });
        }
      }
      
      // If we need to auto-scale
      if (currentlyOverflowing) {
        // Calculate scale to fit viewport
        const scaleX = viewportWidth / rect.width;
        const scaleY = viewportHeight / rect.height;
        const newScale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% of max possible scale
        
        if (Math.abs(newScale - scale) > 0.05) { // Only update if change is significant
          logger.info('Adjusting chat scale to fit viewport', { 
            oldScale: scale,
            newScale,
            scaleX,
            scaleY
          });
          setScale(newScale);
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [position, scale, setScale, docked, viewportDimensions, isOverflowing]);

  return { containerRef, isOverflowing, viewportDimensions };
}
