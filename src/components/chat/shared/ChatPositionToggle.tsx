
import React from 'react';
import { atom, useAtom } from 'jotai';
import { 
  AlignStartHorizontal, 
  AlignEndHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChatPosition } from '@/types/chat/enums';

interface ChatPositionToggleProps {
  position: ChatPosition;
  onPositionChange: (position: ChatPosition) => void;
  className?: string;
}

// Create local atoms for component state
const isHoveringAtom = atom(false);

export function ChatPositionToggle({
  position,
  onPositionChange,
  className
}: ChatPositionToggleProps) {
  const [isHovering, setIsHovering] = useAtom(isHoveringAtom);
  
  const togglePosition = () => {
    const newPosition: ChatPosition = 
      position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    onPositionChange(newPosition);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full', className)}
      onClick={togglePosition}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title={`Move to ${position === 'bottom-right' ? 'left' : 'right'} side`}
    >
      {position === 'bottom-right' ? (
        <AlignStartHorizontal className={cn(
          'h-4 w-4',
          isHovering && 'text-primary'
        )} />
      ) : (
        <AlignEndHorizontal className={cn(
          'h-4 w-4',
          isHovering && 'text-primary'
        )} />
      )}
    </Button>
  );
}
