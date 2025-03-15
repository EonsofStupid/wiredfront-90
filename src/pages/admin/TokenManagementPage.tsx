
import React from 'react';
import { TokenControlPanel } from '@/components/admin/tokens/TokenControlPanel';
import { SettingsContainer } from '@/components/admin/settings/layout/SettingsContainer';

export default function TokenManagementPage() {
  return (
    <SettingsContainer 
      title="Token Management" 
      description="Configure the token system and manage user token balances"
    >
      <TokenControlPanel />
    </SettingsContainer>
  );
}
