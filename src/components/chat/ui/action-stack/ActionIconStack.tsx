
import React from 'react';
import { cn } from '@/lib/utils';
import { ActionButton } from './ActionButton';
import { ActionItem } from '@/types/chat';

interface ActionIconStackProps {
  actions: ActionItem[];
  position?: 'left' | 'right';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export const ActionIconStack: React.FC<ActionIconStackProps> = ({
  actions,
  position = 'right',
  orientation = 'vertical',
  className = '',
  showLabels = false,
  animated = true,
}) => {
  const positionClasses = {
    left: 'left-3',
    right: 'right-3'
  };
  
  const orientationClasses = {
    vertical: 'flex-col space-y-2',
    horizontal: 'flex-row space-x-2'
  };
  
  return (
    <div 
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10 flex',
        orientationClasses[orientation],
        positionClasses[position],
        animated && 'transition-all duration-300 hover:scale-105',
        className
      )}
    >
      {actions.map((action, index) => (
        <div 
          key={action.id} 
          className={cn(
            'relative group',
            animated && 'transition-all duration-300',
            animated && orientation === 'vertical' && `hover:translate-x-${position === 'left' ? '1' : '-1'}`
          )}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          <ActionButton
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
            variant={action.variant}
            size={action.size || 'sm'}
            disabled={action.disabled}
            active={action.active}
            color={action.color}
            glow={action.glow}
            className={cn(
              'chat-action-button',
              animated && 'transition-all duration-300'
            )}
          />
          
          {showLabels && (
            <div className={cn(
              'absolute top-1/2 -translate-y-1/2 bg-black/70 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              position === 'left' ? 'left-full ml-2' : 'right-full mr-2'
            )}>
              {action.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
