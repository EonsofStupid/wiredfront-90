
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';
import { tokenEnforcementModeToLabel } from '@/utils/token-utils';

interface UserTokenCardProps {
  balance: number;
  onAddTokens?: (amount: number) => Promise<void>;
  isSubmitting?: boolean;
}

export function UserTokenCard({ balance, onAddTokens, isSubmitting }: UserTokenCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="mr-2 h-5 w-5 text-yellow-500" />
          Token Balance
        </CardTitle>
        <CardDescription>You have {balance} tokens available</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Tokens are used for AI operations. Each operation consumes a specific amount of tokens.
        </p>
      </CardContent>
      {onAddTokens && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAddTokens(10)}
            disabled={isSubmitting}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add 10 Tokens
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
