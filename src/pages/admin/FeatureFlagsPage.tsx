
import React from 'react';
import FeatureFlags from '@/components/admin/settings/feature-flags/FeatureFlags';
import { SettingsContainer } from '@/components/admin/settings/layout/SettingsContainer';

export default function FeatureFlagsPage() {
  return (
    <SettingsContainer>
      <FeatureFlags />
    </SettingsContainer>
  );
}
