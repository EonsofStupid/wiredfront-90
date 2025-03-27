
import React from 'react';
import { atom, useAtom } from 'jotai';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FeatureToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// Create local atoms for component state
const isHoveringAtom = atom(false);

export function FeatureToggle({ 
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className
}: FeatureToggleProps) {
  const [isHovering, setIsHovering] = useAtom(isHoveringAtom);
  
  return (
    <div 
      className={cn('flex items-center justify-between space-x-2 py-2', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="space-y-0.5">
        <Label 
          htmlFor={id}
          className={cn(
            disabled && 'text-muted-foreground cursor-not-allowed',
            'text-sm font-medium'
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {disabled ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex">
              <Switch
                id={id}
                checked={checked}
                disabled={true}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This feature is currently unavailable</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(
            isHovering && !disabled && 'ring-1 ring-primary ring-offset-1',
            'transition-all'
          )}
        />
      )}
    </div>
  );
}
