
import { useState, useRef, useEffect } from 'react';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook to detect when a component is overflowing the viewport and manage scaling
 */
export const useViewportAwareness = () => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkViewportOverflow = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isOffScreen = 
          rect.left < 0 ||
          rect.right > window.innerWidth ||
          rect.top < 0 ||
          rect.bottom > window.innerHeight;
          
        setIsOverflowing(isOffScreen);
        
        if (isOffScreen !== isOverflowing) {
          logger.debug('Viewport awareness changed', { 
            isOffscreen: isOffScreen,
            rect: {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom
            },
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          });
        }
      }
    };
    
    // Run the check immediately
    checkViewportOverflow();
    
    // Run check on resize
    window.addEventListener('resize', checkViewportOverflow);
    
    // Run check whenever container moves (after drag & drop)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          checkViewportOverflow();
        }
      });
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current, { attributes: true });
    }
    
    return () => {
      window.removeEventListener('resize', checkViewportOverflow);
      observer.disconnect();
    };
  }, [isOverflowing]);
  
  return {
    containerRef,
    isOverflowing
  };
};
