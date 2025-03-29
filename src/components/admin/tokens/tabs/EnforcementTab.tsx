
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { tokenEnforcementModeToLabel } from '@/utils/token-utils';
import { EnumUtils } from '@/lib/enums/EnumUtils';

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
  // Handle mode selection with proper conversion
  const handleModeChange = (value: string) => {
    const mode = EnumUtils.stringToTokenEnforcementMode(value);
    handleUpdateEnforcementConfig(mode);
  };

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
          onValueChange={handleModeChange}
        >
          <SelectTrigger id="enforcement-mode">
            <SelectValue placeholder="Select enforcement mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TokenEnforcementMode.Hard}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.Hard]} (Block operations)
            </SelectItem>
            <SelectItem value={TokenEnforcementMode.Soft}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.Soft]} (Degrade functionality)
            </SelectItem>
            <SelectItem value={TokenEnforcementMode.Warn}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.Warn]} (Allow operations)
            </SelectItem>
            <SelectItem value={TokenEnforcementMode.None}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.None]} (Disable enforcement)
            </SelectItem>
            {/* Add advanced modes for admin users */}
            <SelectItem value={TokenEnforcementMode.RoleBased}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.RoleBased]}
            </SelectItem>
            <SelectItem value={TokenEnforcementMode.ModeBased}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.ModeBased]}
            </SelectItem>
            <SelectItem value={TokenEnforcementMode.Strict}>
              {tokenEnforcementModeToLabel[TokenEnforcementMode.Strict]}
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Determines how token enforcement is applied across the system
        </p>
      </div>
    </div>
  );
}
