
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DockIcons } from '../../icons';
import { Button } from '@/components/ui/button';

export type DockPosition = 'left' | 'right' | 'bottom' | 'top' | 'floating';

interface DockPanelProps {
  title: string;
  children: React.ReactNode;
  position?: DockPosition;
  defaultIsPinned?: boolean;
  defaultIsCollapsed?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClose?: () => void;
  onPositionChange?: (position: DockPosition) => void;
}

export const DockPanel: React.FC<DockPanelProps> = ({
  title,
  children,
  position = 'right',
  defaultIsPinned = false, 
  defaultIsCollapsed = false,
  width = 300,
  height = 'auto',
  className = '',
  onClose,
  onPositionChange
}) => {
  const [isPinned, setIsPinned] = useState(defaultIsPinned);
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    floating: 'relative'
  };

  const sizeStyles = {
    width: position === 'left' || position === 'right' ? width : '100%',
    height: position === 'top' || position === 'bottom' ? height : '100%',
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div 
      className={cn(
        'border border-neon-blue/20 shadow-md bg-black/50 backdrop-blur-lg',
        'flex flex-col',
        !isPinned && 'cursor-grab active:cursor-grabbing',
        position !== 'floating' && positionClasses[position],
        isCollapsed && (
          position === 'left' ? 'w-10' : 
          position === 'right' ? 'w-10' : 
          position === 'top' ? 'h-10' : 
          position === 'bottom' ? 'h-10' : ''
        ),
        'transition-all duration-300 ease-in-out',
        position === 'floating' && 'rounded-lg overflow-hidden',
        className
      )}
      style={!isCollapsed ? sizeStyles : undefined}
    >
      <div className="flex items-center justify-between p-2 bg-black/30 border-b border-neon-blue/20">
        {!isCollapsed && <span className="text-sm font-medium text-white/80 truncate">{title}</span>}
        
        <div className="flex items-center space-x-1 ml-auto">
          {!isCollapsed && onPositionChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/60 hover:text-white/90 hover:bg-white/10"
              onClick={() => {
                const positions: DockPosition[] = ['left', 'right', 'bottom', 'top', 'floating'];
                const currentIndex = positions.indexOf(position);
                const nextPosition = positions[(currentIndex + 1) % positions.length];
                onPositionChange(nextPosition);
              }}
            >
              <DockIcons.move className="h-3.5 w-3.5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/60 hover:text-white/90 hover:bg-white/10"
            onClick={togglePin}
          >
            {isPinned ? (
              <DockIcons.unpin className="h-3.5 w-3.5" />
            ) : (
              <DockIcons.pin className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/60 hover:text-white/90 hover:bg-white/10"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <DockIcons.maximize className="h-3.5 w-3.5" />
            ) : (
              <DockIcons.minimize className="h-3.5 w-3.5" />
            )}
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/60 hover:text-white/90 hover:bg-white/10"
              onClick={handleClose}
            >
              <DockIcons.close className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
};
