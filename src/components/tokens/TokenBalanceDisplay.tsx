
import React from 'react';
import { useTokenManagement, withTokenErrorBoundary } from '@/hooks/useTokenManagement';
import { TokenAuthGuard } from './TokenAuthGuard';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Coins, AlertCircle } from 'lucide-react';

interface TokenBalanceDisplayProps {
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

const TokenBalanceDisplayComponent: React.FC<TokenBalanceDisplayProps> = ({
  showLabel = true,
  compact = false,
  className = ''
}) => {
  const {
    tokenBalance,
    isTokenEnforcementEnabled,
    enforcementMode,
    isLoading,
    error
  } = useTokenManagement();

  if (error) {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle size={16} className="mr-1" />
        <span className="text-xs">Token error</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-5 w-16 bg-muted rounded"></div>
      </div>
    );
  }

  // If tokens aren't being enforced, don't show the display
  if (!isTokenEnforcementEnabled && !compact) {
    return null;
  }

  return (
    <TokenAuthGuard fallback={compact ? <span className="text-muted-foreground text-xs">Sign in</span> : null}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${className}`}>
              <Coins size={compact ? 14 : 16} className={`mr-1 ${isTokenEnforcementEnabled ? 'text-amber-500' : 'text-muted-foreground'}`} />
              
              {showLabel && !compact && (
                <span className="text-sm mr-1.5">Tokens:</span>
              )}
              
              <Badge variant={isTokenEnforcementEnabled ? "secondary" : "outline"} className={compact ? "text-xs px-1.5 py-0" : ""}>
                {tokenBalance}
              </Badge>
              
              {isTokenEnforcementEnabled && !compact && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {enforcementMode}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium text-sm">Token Balance: {tokenBalance}</p>
              {isTokenEnforcementEnabled ? (
                <p className="text-xs text-muted-foreground">Enforcement: {enforcementMode}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Token enforcement is disabled</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TokenAuthGuard>
  );
};

// Wrap with error boundary
export const TokenBalanceDisplay = withTokenErrorBoundary(TokenBalanceDisplayComponent);
