import { jsx as _jsx } from "react/jsx-runtime";
import { TokenControlPanel } from '@/components/admin/tokens/TokenControlPanel';
import { SettingsContainer } from '@/components/admin/settings/layout/SettingsContainer';
export default function TokenManagementPage() {
    return (_jsx(SettingsContainer, { title: "Token Management", description: "Configure the token system and manage user token balances", children: _jsx(TokenControlPanel, {}) }));
}
