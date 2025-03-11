
import { useEffect, useRef, useState } from 'react';
import { useChatUIStore } from '../store/useChatUIStore';

export function useViewportAwareness() {
  const { position, scale, setScale, docked } = useChatUIStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Keep chat in viewport
  useEffect(() => {
    if (!containerRef.current || !docked) return;
    
    const updatePosition = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check if overflowing horizontally
      const isOverflowingX = (position === 'bottom-right' && rect.right > viewportWidth) || 
                            (position === 'bottom-left' && rect.left < 0);
                            
      // Check if overflowing vertically
      const isOverflowingY = rect.bottom > viewportHeight;
      
      setIsOverflowing(isOverflowingX || isOverflowingY);
      
      // If we need to auto-scale
      if (isOverflowingX || isOverflowingY) {
        // Calculate scale to fit viewport
        const scaleX = viewportWidth / rect.width;
        const scaleY = viewportHeight / rect.height;
        const newScale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% of max possible scale
        
        if (newScale < scale) {
          setScale(newScale);
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [position, scale, setScale, docked]);

  return { containerRef, isOverflowing };
}
