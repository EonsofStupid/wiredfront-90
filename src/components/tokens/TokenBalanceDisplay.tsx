
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { Coins, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export function TokenBalanceDisplay() {
  const { 
    tokenBalance, 
    isTokenEnforcementEnabled, 
    isLoading,
    tokensPerQuery,
    freeQueryLimit,
    queriesUsed,
    enforcementMode
  } = useTokenManagement();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[100px]" />
        </CardContent>
      </Card>
    );
  }

  if (!isTokenEnforcementEnabled) {
    return null; // Don't show anything if token enforcement is disabled
  }

  // Low balance warning (when tokens are less than 2x the required per query)
  const isLowBalance = tokenBalance < (tokensPerQuery * 2);
  
  // Free queries remaining
  const freeQueriesRemaining = Math.max(0, freeQueryLimit - queriesUsed);
  const showFreeQueries = freeQueryLimit > 0 && freeQueriesRemaining > 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Your Token Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{tokenBalance}</div>
          <div className="text-sm text-muted-foreground">
            Cost per message: {tokensPerQuery}
          </div>
        </div>
        
        {/* Token usage progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span>Token Usage</span>
            <span>{tokenBalance} remaining</span>
          </div>
          <Progress 
            value={(tokenBalance / (tokenBalance + queriesUsed * tokensPerQuery)) * 100} 
            className="h-2"
          />
        </div>
        
        {showFreeQueries && (
          <div className="bg-muted p-2 rounded text-sm">
            <span className="font-medium">{freeQueriesRemaining}</span> free queries remaining
          </div>
        )}
        
        {isLowBalance && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Token Balance</AlertTitle>
            <AlertDescription>
              You don't have enough tokens for your next {Math.floor(tokenBalance / tokensPerQuery) + 1} message(s). 
              Contact an administrator to get more tokens.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {enforcementMode !== 'always' && (
        <CardFooter className="bg-muted/50 rounded-b-lg text-xs text-muted-foreground pt-2">
          Token enforcement mode: {enforcementMode.replace('_', ' ')}
        </CardFooter>
      )}
    </Card>
  );
}
