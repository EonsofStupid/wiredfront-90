
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

interface AdvancedTabProps {
  tokenBalance: number;
  enforcementMode: TokenEnforcementMode;
  addTokens: (amount: number) => void;
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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="self-tokens">Your Token Balance</Label>
        <div className="flex space-x-2">
          <Input 
            id="self-tokens" 
            type="number"
            value={tokenBalance.toString()}
            readOnly
          />
          <Button
            variant="outline"
            onClick={() => addTokens(100)}
            disabled={isSubmitting}
          >
            Add 100
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>System Test Mode</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, tokens will not be spent in development
          </p>
        </div>
        <Switch
          checked={enforcementMode === 'never'}
          onCheckedChange={(checked) => 
            handleUpdateEnforcementConfig(checked ? 'never' : 'always')
          }
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
