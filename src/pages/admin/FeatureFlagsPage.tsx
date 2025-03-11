
import React from 'react';
import FeatureFlags from '@/components/admin/settings/feature-flags/FeatureFlags';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function FeatureFlagsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <FeatureFlags />
      </div>
    </AdminLayout>
  );
}
