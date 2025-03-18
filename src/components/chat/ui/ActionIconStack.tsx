
import React from 'react';
import { cn } from '@/lib/utils';
import { ActionButton } from './ActionButton';
import { LucideIcon } from 'lucide-react';

export interface ActionItem {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

interface ActionIconStackProps {
  actions: ActionItem[];
  position?: 'left' | 'right';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const ActionIconStack: React.FC<ActionIconStackProps> = ({
  actions,
  position = 'right',
  orientation = 'vertical',
  className = '',
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
        className
      )}
    >
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
          variant={action.variant || 'ghost'}
          size="sm"
          className="chat-action-button"
        />
      ))}
    </div>
  );
};
