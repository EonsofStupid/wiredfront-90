import { jsx as _jsx } from "react/jsx-runtime";
import FeatureFlags from '@/components/admin/settings/feature-flags/FeatureFlags';
import { SettingsContainer } from '@/components/admin/settings/layout/SettingsContainer';
export default function FeatureFlagsPage() {
    return (_jsx(SettingsContainer, { title: "Feature Flags", description: "Manage feature availability across the application", children: _jsx(FeatureFlags, {}) }));
}
