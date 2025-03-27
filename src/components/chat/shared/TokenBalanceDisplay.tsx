
import React from 'react';
import { cn } from '@/lib/utils';
import { useTokenStore } from '../store/token';

interface TokenBalanceDisplayProps {
  className?: string;
}

export function TokenBalanceDisplay({ className }: TokenBalanceDisplayProps) {
  const { balance, enforcementMode } = useTokenStore();
  
  const getStatusColor = () => {
    if (balance > 5000) return 'text-green-500';
    if (balance > 1000) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="text-sm">
        <span className="text-muted-foreground">Tokens:</span>
        <span className={cn('ml-1 font-medium', getStatusColor())}>
          {balance.toLocaleString()}
        </span>
      </div>
      {enforcementMode !== 'never' && (
        <div className={cn(
          'text-xs px-1.5 py-0.5 rounded',
          enforcementMode === 'warn' ? 'bg-yellow-500/20 text-yellow-500' : 
          enforcementMode === 'strict' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
        )}>
          {enforcementMode === 'warn' ? 'Warning' : 
           enforcementMode === 'strict' ? 'Enforced' : 'Free'}
        </div>
      )}
    </div>
  );
}
