
import React from 'react';
import { useTokens } from './hooks/useTokens';
import { Badge } from '@/components/ui/badge';
import { Coins, AlertTriangle, Info } from 'lucide-react';
import { getTokenStatusColor } from '@/utils/token-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { Button } from '@/components/ui/button';

interface EditorModeTokenDisplayProps {
  className?: string;
  showDetails?: boolean;
  onAddTokens?: () => void;
}

export function EditorModeTokenDisplay({ 
  className = '', 
  showDetails = false,
  onAddTokens
}: EditorModeTokenDisplayProps) {
  const { 
    balance, 
    usagePercent, 
    isLowBalance, 
    enforcementMode, 
    tokenLimit 
  } = useTokens();
  
  const isTokenEnforced = enforcementMode !== TokenEnforcementMode.None && 
                          enforcementMode !== TokenEnforcementMode.Never;
                          
  const statusColor = getTokenStatusColor(balance);

  // For editor mode, we want a more detailed token display that's appropriate for the editor context
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={isLowBalance ? "destructive" : "secondary"} className="flex items-center gap-1.5 px-3 py-1">
              <Coins className="h-3.5 w-3.5" />
              <span>{balance} {tokenLimit ? `/ ${tokenLimit}` : ''}</span>
              {isLowBalance && isTokenEnforced && (
                <AlertTriangle className="h-3 w-3 ml-1" />
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="w-64">
            <div className="space-y-2">
              <p className="font-semibold">Token Balance: {balance}</p>
              {tokenLimit && (
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      isLowBalance ? 'bg-destructive' : 'bg-primary'
                    }`} 
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {isTokenEnforced 
                  ? `Enforcement mode: ${enforcementMode}`
                  : 'Token enforcement is disabled'
                }
              </p>
              {isLowBalance && isTokenEnforced && (
                <p className="text-sm text-destructive">
                  Low token balance may affect service quality
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showDetails && (
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {usagePercent}% used
          </span>
          {onAddTokens && (
            <Button variant="outline" size="sm" onClick={onAddTokens} className="ml-2">
              Add Tokens
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
