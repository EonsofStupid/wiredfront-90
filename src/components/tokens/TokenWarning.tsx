
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTokenStore } from '@/stores/token';
import { Button } from '@/components/ui/button';
import { TokenEnforcementMode } from '@/components/chat/types/chat/enums';

interface TokenWarningProps {
  balance: number;
  threshold?: number;
  onDismiss?: () => void;
  onPurchase?: () => void;
}

export const TokenWarning = ({ 
  balance, 
  threshold = 100,
  onDismiss,
  onPurchase 
}: TokenWarningProps) => {
  const { enforcementMode } = useTokenStore();
  
  if (balance > threshold || enforcementMode === TokenEnforcementMode.None) {
    return null;
  }
  
  return (
    <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Low Token Balance</AlertTitle>
      <AlertDescription className="text-sm">
        <p>You have {balance} tokens remaining in your account.</p>
        {balance <= 0 ? (
          <p className="font-medium mt-1">
            {enforcementMode === TokenEnforcementMode.Hard 
              ? 'You cannot send messages until you add more tokens.' 
              : 'Your experience may be limited.'}
          </p>
        ) : (
          <p className="mt-1">Consider adding more tokens soon.</p>
        )}
        
        <div className="flex gap-2 mt-3">
          {onPurchase && (
            <Button size="sm" onClick={onPurchase}>
              Add Tokens
            </Button>
          )}
          {onDismiss && (
            <Button variant="outline" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
