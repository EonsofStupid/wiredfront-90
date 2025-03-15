
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { Coins, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function TokenBalanceDisplay() {
  const { 
    tokenBalance, 
    isTokenEnforcementEnabled, 
    isLoading,
    tokensPerQuery
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

  // Low balance warning
  const isLowBalance = tokenBalance < tokensPerQuery;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Your Token Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{tokenBalance}</div>
          <div className="text-sm text-muted-foreground">
            Cost per message: {tokensPerQuery}
          </div>
        </div>
        
        {isLowBalance && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Token Balance</AlertTitle>
            <AlertDescription>
              You don't have enough tokens for your next message. 
              Contact an administrator to get more tokens.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
