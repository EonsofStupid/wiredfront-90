
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { tokenEnforcementModeToLabel } from '@/utils/token-utils';
import { Loader2 } from 'lucide-react';
import { EnumUtils } from '@/lib/enums/EnumUtils';

interface AdvancedTabProps {
  tokenBalance: number;
  enforcementMode: TokenEnforcementMode;
  addTokens: (amount: number) => Promise<void>;
  handleUpdateEnforcementConfig: (mode: TokenEnforcementMode) => Promise<void>;
  isSubmitting: boolean;
}

export function AdvancedTab({
  tokenBalance,
  enforcementMode,
  addTokens,
  handleUpdateEnforcementConfig,
  isSubmitting
}: AdvancedTabProps) {
  const [customTokenAmount, setCustomTokenAmount] = useState('50');
  
  const handleAddCustomTokens = () => {
    const amount = parseInt(customTokenAmount);
    if (!isNaN(amount) && amount > 0) {
      addTokens(amount);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Manual Token Management</h3>
        <div className="flex items-end gap-2">
          <div className="space-y-2 flex-1">
            <Label htmlFor="custom-token-amount">Add Custom Amount</Label>
            <Input
              id="custom-token-amount"
              type="number"
              min="1"
              value={customTokenAmount}
              onChange={(e) => setCustomTokenAmount(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddCustomTokens} 
            disabled={isSubmitting || !customTokenAmount || parseInt(customTokenAmount) <= 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>Add Tokens</>
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Advanced Enforcement Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="advanced-enforcement-mode">Set Enforcement Mode</Label>
          <Select
            value={enforcementMode}
            onValueChange={(value) => handleUpdateEnforcementConfig(EnumUtils.stringToTokenEnforcementMode(value))}
            disabled={isSubmitting}
          >
            <SelectTrigger id="advanced-enforcement-mode">
              <SelectValue placeholder="Select enforcement mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TokenEnforcementMode).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {tokenEnforcementModeToLabel[mode as TokenEnforcementMode]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Advanced modes provide more granular control over token enforcement
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Current token balance: <span className="font-medium">{tokenBalance}</span> tokens
        </p>
      </div>
    </div>
  );
}
