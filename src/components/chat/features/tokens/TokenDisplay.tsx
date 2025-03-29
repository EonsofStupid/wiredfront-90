
import React from 'react';
import { useTokens } from './hooks/useTokens';
import { Badge } from '@/components/ui/badge';
import { Coins, AlertTriangle } from 'lucide-react';
import { getTokenStatusColor } from '@/utils/token-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TokenEnforcementMode } from '@/components/chat/types/chat/enums';

interface TokenDisplayProps {
  compact?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function TokenDisplay({ compact = false, showTooltip = true, className = '' }: TokenDisplayProps) {
  const { balance, usagePercent, isLowBalance, enforcementMode } = useTokens();
  
  const isTokenEnforced = enforcementMode !== TokenEnforcementMode.None && 
                          enforcementMode !== TokenEnforcementMode.Never;
                          
  const statusColor = getTokenStatusColor(balance);
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1 ${className}`}>
              <Coins className={`h-4 w-4 ${statusColor}`} />
              <span className={`text-sm font-medium ${statusColor}`}>{balance}</span>
              {isLowBalance && isTokenEnforced && (
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent>
              <p>Current token balance: {balance}</p>
              {isTokenEnforced && (
                <p className="text-xs text-muted-foreground">
                  {isLowBalance ? 'Low token balance' : 'Token enforcement active'}
                </p>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={isLowBalance ? "destructive" : "secondary"} className="flex items-center gap-1.5">
        <Coins className="h-3.5 w-3.5" />
        <span>{balance} tokens</span>
        {isLowBalance && isTokenEnforced && (
          <AlertTriangle className="h-3 w-3 ml-1" />
        )}
      </Badge>
      
      {isLowBalance && isTokenEnforced && showTooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Low token balance warning</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
