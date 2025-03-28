
import React from 'react';
import { useTokenStore } from '../../store/token/store';
import { Coins } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export const TokenDisplay = () => {
  const { balance, lastUpdated, tokensPerQuery, queriesUsed, freeQueryLimit } = useTokenStore();
  
  // Calculate remaining free queries
  const freeQueriesRemaining = Math.max(0, freeQueryLimit - queriesUsed);
  const freeQueryPercentage = (queriesUsed / freeQueryLimit) * 100;
  
  // Format the last updated date
  const lastUpdatedFormatted = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });
  
  return (
    <div className="p-3 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-medium text-sm">Token Balance</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-mono bg-primary/10 px-2 py-0.5 rounded">
              {balance.toLocaleString()}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Last updated: {lastUpdatedFormatted}</p>
            <p>Cost per query: {tokensPerQuery} tokens</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="mb-1 flex justify-between text-xs">
        <span>Free Queries: {queriesUsed}/{freeQueryLimit}</span>
        <span>{freeQueriesRemaining} remaining</span>
      </div>
      
      <Progress 
        value={freeQueryPercentage} 
        className="h-2" 
      />
      
      {freeQueriesRemaining === 0 && (
        <p className="text-xs mt-2 text-yellow-500">
          Free quota exhausted. Using token balance.
        </p>
      )}
    </div>
  );
};
