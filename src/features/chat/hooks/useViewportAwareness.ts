
import { useEffect, useRef, useState } from 'react';

interface ViewportAwarenessResult {
  containerRef: React.RefObject<HTMLDivElement>;
  isOverflowing: boolean;
  isNearEdge: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function useViewportAwareness(): ViewportAwarenessResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // Check if container is overflowing viewport
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isHorizontalOverflow = rect.left < 0 || rect.right > window.innerWidth;
      const isVerticalOverflow = rect.top < 0 || rect.bottom > window.innerHeight;
      
      setIsOverflowing(isHorizontalOverflow || isVerticalOverflow);
      
      // Check if near edge (20px threshold)
      const nearLeft = rect.left < 20;
      const nearRight = rect.right > window.innerWidth - 20;
      const nearTop = rect.top < 20;
      const nearBottom = rect.bottom > window.innerHeight - 20;
      
      setIsNearEdge(nearLeft || nearRight || nearTop || nearBottom);
    };
    
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      checkOverflow();
    };
    
    checkOverflow();
    window.addEventListener('resize', handleResize);
    
    // Set up an interval to continuously check
    const intervalId = setInterval(checkOverflow, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }, []);
  
  return {
    containerRef,
    isOverflowing,
    isNearEdge,
    viewportWidth: viewportSize.width,
    viewportHeight: viewportSize.height
  };
}
