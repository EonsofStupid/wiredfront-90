
import { useEffect, useRef, useState } from 'react';
import { logger } from '../services/LoggingService';

interface ViewportAwarenessOptions {
  threshold?: number;
  debounceMs?: number;
}

export function useViewportAwareness(options: ViewportAwarenessOptions = {}) {
  const { 
    threshold = 100, // px from viewport edge
    debounceMs = 100 
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const [edge, setEdge] = useState<'top' | 'right' | 'bottom' | 'left' | null>(null);
  
  // Check if the element is near the viewport edge
  useEffect(() => {
    const checkPosition = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check for visibility in viewport
      const isInViewport = 
        rect.top < viewportHeight &&
        rect.bottom > 0 &&
        rect.left < viewportWidth &&
        rect.right > 0;
      
      setIsVisible(isInViewport);
      
      // Check if overflowing viewport
      const isOverflow = 
        rect.top < 0 ||
        rect.bottom > viewportHeight ||
        rect.left < 0 ||
        rect.right > viewportWidth;
      
      setIsOverflowing(isOverflow);
      
      // Check for edge proximity
      const isNearTop = rect.top < threshold;
      const isNearRight = viewportWidth - rect.right < threshold;
      const isNearBottom = viewportHeight - rect.bottom < threshold;
      const isNearLeft = rect.left < threshold;
      
      const nearEdge = isNearTop || isNearRight || isNearBottom || isNearLeft;
      setIsNearEdge(nearEdge);
      
      // Determine which edge
      if (isNearTop) setEdge('top');
      else if (isNearRight) setEdge('right');
      else if (isNearBottom) setEdge('bottom');
      else if (isNearLeft) setEdge('left');
      else setEdge(null);
    };
    
    // Debounced handler
    let timeout: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkPosition, debounceMs);
    };
    
    // Initial check
    checkPosition();
    
    // Set up listeners
    window.addEventListener('resize', debouncedCheck);
    window.addEventListener('scroll', debouncedCheck);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', debouncedCheck);
      window.removeEventListener('scroll', debouncedCheck);
    };
  }, [threshold, debounceMs]);
  
  return {
    containerRef,
    isOverflowing,
    isVisible,
    isNearEdge,
    edge
  };
}
