
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect when a component is overflowing the viewport
 * and adjust its scale accordingly
 */
export const useViewportAwareness = (scaleStep = 0.05) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    // Function to check if the element is overflowing the viewport
    const checkOverflow = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const isOverflowingX = rect.right > viewportWidth || rect.left < 0;
      const isOverflowingY = rect.bottom > viewportHeight || rect.top < 0;
      
      const newIsOverflowing = isOverflowingX || isOverflowingY;
      setIsOverflowing(newIsOverflowing);
      
      // If overflowing, reduce scale until it fits
      if (newIsOverflowing && scale > 0.7) {
        setScale(prevScale => Math.max(0.7, prevScale - scaleStep));
      } 
      // If not overflowing and scale is less than 1, gradually increase
      else if (!newIsOverflowing && scale < 1) {
        setScale(prevScale => Math.min(1, prevScale + scaleStep));
      }
    };
    
    // Check on mount and when window resizes
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check after any scale change
    const timeoutId = setTimeout(checkOverflow, 300);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
    };
  }, [scale, scaleStep]);
  
  return { containerRef, isOverflowing, scale };
};
