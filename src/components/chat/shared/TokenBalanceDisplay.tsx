
import React from 'react';
import { cn } from '@/lib/utils';
import { useTokenStore } from '../store/token';
import { Badge } from '@/components/ui/badge';
import { UIEnforcementMode } from '@/types/chat/enums';

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

  const getEnforcementBadge = (mode: UIEnforcementMode) => {
    switch(mode) {
      case 'warn':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">Warning</Badge>;
      case 'strict':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-500">Enforced</Badge>;
      case 'never':
        return <Badge variant="success" className="bg-green-500/20 text-green-500">Free</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="text-sm">
        <span className="text-muted-foreground">Tokens:</span>
        <span className={cn('ml-1 font-medium', getStatusColor())}>
          {balance.toLocaleString()}
        </span>
      </div>
      {enforcementMode !== 'never' && getEnforcementBadge(enforcementMode as UIEnforcementMode)}
    </div>
  );
}
