
import { useRef, useEffect } from "react";
import { logger } from "@/services/chat/LoggingService";

interface UseDragBoundariesProps {
  docked: boolean;
  position: string;
}

export function useDragBoundaries({ docked, position }: UseDragBoundariesProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const prevPosition = useRef(position);

  // Handle position change and viewport boundaries
  useEffect(() => {
    if (!elementRef.current || docked) return;

    const updatePosition = () => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let transformX = 0;
      let transformY = 0;
      
      // Horizontal bounds
      if (rect.right > viewportWidth) {
        transformX = viewportWidth - rect.right - 20;
      } else if (rect.left < 0) {
        transformX = Math.abs(rect.left) + 20;
      }
      
      // Vertical bounds
      if (rect.bottom > viewportHeight) {
        transformY = viewportHeight - rect.bottom - 20;
      } else if (rect.top < 0) {
        transformY = Math.abs(rect.top) + 20;
      }
      
      if (transformX !== 0 || transformY !== 0) {
        elementRef.current.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
        logger.info('Chat position adjusted to fit viewport', { transformX, transformY });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [docked]);

  // Log position changes
  useEffect(() => {
    if (prevPosition.current !== position) {
      logger.info('Chat position changed', { from: prevPosition.current, to: position });
      prevPosition.current = position;
    }
  }, [position]);

  return { elementRef };
}
