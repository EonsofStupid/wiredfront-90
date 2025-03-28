
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useTokenStore } from '../store/token';
import { TokenEnforcementMode } from '@/types/chat/tokens';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { tokenToUIEnforcementMode } from '../types/enums-mapper';

export const TokenBalanceDisplay = () => {
  const tokenState = useTokenStore();
  
  // Calculate derived values
  const tokenLimit = tokenState.limit || 0;
  const tokensUsed = tokenState.used || 0;
  const tokensRemaining = Math.max(0, tokenLimit - tokensUsed);
  const isLoading = tokenState.isLoading || false;
  const usagePercent = tokenState.usagePercent || 0;
  const isLowBalance = tokenState.isLowBalance || false;
  const enforcementMode = tokenState.enforcementMode || TokenEnforcementMode.None;
  
  // Get UI metadata for the current enforcement mode
  const enforcementDisplay = tokenToUIEnforcementMode[enforcementMode];
  
  // Generate color based on usage percentage
  const getProgressColor = () => {
    if (usagePercent >= 90) return 'bg-red-500';
    if (usagePercent >= 75) return 'bg-orange-500';
    if (usagePercent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
        <div className="h-2 bg-gray-200 rounded w-full dark:bg-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium flex items-center">
          <span>Token Balance</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <Info size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {enforcementDisplay.description}. 
                  {enforcementMode !== TokenEnforcementMode.None && 
                    ` You have used ${tokensUsed} out of ${tokenLimit} available tokens.`
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className={cn(
          "text-xs font-medium",
          isLowBalance ? "text-red-500" : "text-muted-foreground"
        )}>
          {tokensRemaining.toLocaleString()} remaining
        </span>
      </div>
      
      <Progress 
        value={usagePercent} 
        className="h-2"
        indicatorClassName={getProgressColor()}
      />
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          {usagePercent}% used
        </span>
        <span className={cn(
          "text-xs font-medium",
          enforcementDisplay.color
        )}>
          {enforcementDisplay.label}
        </span>
      </div>
    </div>
  );
};

export default TokenBalanceDisplay;
