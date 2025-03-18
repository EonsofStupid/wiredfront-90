
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Pin, PinOff } from 'lucide-react';

export type DockPosition = 'left' | 'right' | 'top' | 'bottom';

interface DockPanelProps {
  children: React.ReactNode;
  title: string;
  position?: DockPosition;
  defaultIsPinned?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  onClose?: () => void;
  className?: string;
}

export const DockPanel: React.FC<DockPanelProps> = ({
  children,
  title,
  position = 'right',
  defaultIsPinned = true,
  width = 250,
  minWidth = 200,
  maxWidth = 400,
  onClose,
  className,
}) => {
  const [isPinned, setIsPinned] = useState(defaultIsPinned);
  const [isHovered, setIsHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0'
  };
  
  const dimensionStyles = {
    left: { width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px`, height: '100%' },
    right: { width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px`, height: '100%' },
    top: { height: `${width}px`, minHeight: `${minWidth}px`, maxHeight: `${maxWidth}px`, width: '100%' },
    bottom: { height: `${width}px`, minHeight: `${minWidth}px`, maxHeight: `${maxWidth}px`, width: '100%' }
  };
  
  const transformValues = {
    left: isPinned ? 'translateX(0)' : 'translateX(-100%)',
    right: isPinned ? 'translateX(0)' : 'translateX(100%)',
    top: isPinned ? 'translateY(0)' : 'translateY(-100%)',
    bottom: isPinned ? 'translateY(0)' : 'translateY(100%)'
  };
  
  // Handle click outside to close when not pinned
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && 
          !isPinned && 
          !isHovered && 
          !panelRef.current.contains(event.target as Node)) {
        onClose && onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinned, isHovered, onClose]);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <div
      ref={panelRef}
      className={cn(
        'chat-glass-card chat-neon-border fixed z-50 transition-transform duration-300 flex flex-col',
        positionClasses[position],
        className
      )}
      style={{
        ...dimensionStyles[position],
        transform: transformValues[position]
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/40">
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="flex space-x-1">
          <button 
            className="p-1 text-white/70 hover:text-white rounded-sm hover:bg-white/10 transition-colors"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin panel" : "Pin panel"}
          >
            {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          {onClose && (
            <button 
              className="p-1 text-white/70 hover:text-white rounded-sm hover:bg-white/10 transition-colors"
              onClick={onClose}
              title="Close panel"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
