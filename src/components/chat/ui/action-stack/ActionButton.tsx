
import React from 'react';
import { Button } from '@/components/ui/button';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { coreColors } from '@/styles/theme/core-variables';

export interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  active?: boolean;
  color?: string;
  glow?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  active = false,
  color,
  glow = false,
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  const getVariantClasses = (variant: string) => {
    const baseClasses = {
      primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
      ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
      danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    };

    if (active) {
      return `${baseClasses[variant as keyof typeof baseClasses]} ring-2 ring-offset-2 ring-offset-background ${glow ? 'shadow-glow' : ''}`;
    }

    return baseClasses[variant as keyof typeof baseClasses];
  };
  
  return (
    <Button
      type="button"
      className={cn(
        sizeClasses[size],
        getVariantClasses(variant),
        'rounded-full flex items-center justify-center transition-all duration-300',
        active && 'scale-105',
        glow && 'shadow-glow',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={color ? { 
        backgroundColor: active ? color : 'transparent',
        borderColor: color,
        color: active ? '#fff' : color,
        boxShadow: glow && active ? `0 0 10px ${color}, 0 0 15px ${color}30` : 'none'
      } : undefined}
    >
      <Icon size={iconSizes[size]} />
    </Button>
  );
};
