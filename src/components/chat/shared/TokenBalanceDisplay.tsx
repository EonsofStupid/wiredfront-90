
import React from 'react';
import { Card } from '@/components/ui/card';
import { useTokenStore } from '../store/token/store';
import { UIEnforcementMode } from '@/types/chat/enums';
import { tokenToUIEnforcementMode } from '../types/enums-mapper';

interface TokenBalanceDisplayProps {
  compact?: boolean;
  showWarning?: boolean;
  className?: string;
}

/**
 * Displays the user's token balance and enforcement mode
 */
export const TokenBalanceDisplay = ({ 
  compact = false, 
  showWarning = true,
  className = '' 
}: TokenBalanceDisplayProps) => {
  const { 
    balance, 
    enforcementMode,
    usagePercent, 
    isLowBalance 
  } = useTokenStore();
  
  if (!showWarning && isLowBalance) {
    return null;
  }
  
  // Convert database enforcement mode to UI enforcement mode
  const uiEnforcementMode = tokenToUIEnforcementMode(enforcementMode);
  
  if (compact) {
    return (
      <div className={`text-xs flex items-center ${className}`}>
        <span className={`font-mono ${isLowBalance ? 'text-red-500' : 'text-gray-500'}`}>
          {balance} tokens
        </span>
      </div>
    );
  }
  
  return (
    <Card className={`p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Token Balance</h4>
          <p className={`text-2xl font-mono ${isLowBalance ? 'text-red-500' : ''}`}>
            {balance}
          </p>
        </div>
        
        {uiEnforcementMode !== UIEnforcementMode.Never && (
          <div className="text-xs text-gray-500">
            <span>
              {uiEnforcementMode === UIEnforcementMode.Always 
                ? 'Token enforcement is active' 
                : 'Warning on low tokens'}
            </span>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className={`h-2 rounded-full ${
                  usagePercent > 80 ? 'bg-red-500' : 
                  usagePercent > 50 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
