
import { useState, useEffect, useRef, useCallback } from 'react';

export function useViewportAwareness() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  
  const checkOverflow = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if chat window exceeds viewport boundaries
    const isRight = rect.right > window.innerWidth;
    const isBottom = rect.bottom > window.innerHeight;
    const isLeft = rect.left < 0;
    const isTop = rect.top < 0;
    
    setIsOverflowing(isRight || isBottom || isLeft || isTop);
  }, []);
  
  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow]);
  
  return { containerRef, isOverflowing, checkOverflow };
}
