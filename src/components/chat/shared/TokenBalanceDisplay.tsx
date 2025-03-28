
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useTokenStore } from '../store/token';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { tokenToUIEnforcementMode } from '../types/enums-mapper';

interface TokenBalanceDisplayProps {
  variant?: 'minimal' | 'compact' | 'full';
  className?: string;
}

export function TokenBalanceDisplay({ 
  variant = 'compact', 
  className 
}: TokenBalanceDisplayProps) {
  const { 
    balance, 
    limit, 
    used, 
    enforcementMode, 
    isLoading,
    usagePercent,
    isLowBalance
  } = useTokenStore();

  const progressClassnames = cn(
    isLowBalance && 'bg-destructive'
  );

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs text-muted-foreground">Loading tokens...</span>
      </div>
    );
  }

  // Minimal variant - just shows icon
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "h-3 w-3 rounded-full", 
          isLowBalance ? "bg-destructive" : "bg-primary"
        )} />
      </div>
    );
  }

  // Compact variant - just shows balance
  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Tokens: {balance}</span>
          <span className={cn(
            "text-xs", 
            isLowBalance ? "text-destructive" : "text-muted-foreground"
          )}>
            {usagePercent}%
          </span>
        </div>
        <Progress value={usagePercent} className={progressClassnames} />
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Token Balance</span>
        <span className="text-xs text-muted-foreground">
          Mode: {tokenToUIEnforcementMode(enforcementMode)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm">{balance}</span>
        <span className={cn(
          "text-xs", 
          isLowBalance ? "text-destructive" : "text-muted-foreground"
        )}>
          {used} of {limit} used ({usagePercent}%)
        </span>
      </div>
      
      <Progress value={usagePercent} className={progressClassnames} />
    </div>
  );
}
