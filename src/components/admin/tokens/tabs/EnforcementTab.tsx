
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TokenEnforcementMode } from '@/types/chat/tokens';

interface EnforcementTabProps {
  isTokenEnforcementEnabled: boolean;
  enforcementMode: TokenEnforcementMode;
  toggleTokenEnforcement: () => void;
  handleUpdateEnforcementConfig: (mode: TokenEnforcementMode) => Promise<void>;
  isSubmitting: boolean;
}

export function EnforcementTab({
  isTokenEnforcementEnabled,
  enforcementMode,
  toggleTokenEnforcement,
  handleUpdateEnforcementConfig,
  isSubmitting
}: EnforcementTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-1">
          <Label htmlFor="token-enforcement">Token Enforcement</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, users must have tokens to use AI features
          </p>
        </div>
        <Switch
          id="token-enforcement"
          checked={isTokenEnforcementEnabled}
          onCheckedChange={toggleTokenEnforcement}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="enforcement-mode">Enforcement Mode</Label>
        <Select
          disabled={!isTokenEnforcementEnabled || isSubmitting}
          value={enforcementMode}
          onValueChange={(value) => handleUpdateEnforcementConfig(value as TokenEnforcementMode)}
        >
          <SelectTrigger id="enforcement-mode">
            <SelectValue placeholder="Select enforcement mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TokenEnforcementMode.Hard}>Hard (Block operations)</SelectItem>
            <SelectItem value={TokenEnforcementMode.Soft}>Soft (Degrade functionality)</SelectItem>
            <SelectItem value={TokenEnforcementMode.Warn}>Warn only (Allow operations)</SelectItem>
            <SelectItem value={TokenEnforcementMode.None}>None (Disable enforcement)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Determines how token enforcement is applied across the system
        </p>
      </div>
    </div>
  );
}
