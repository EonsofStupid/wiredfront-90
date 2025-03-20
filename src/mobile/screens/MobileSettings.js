import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MobileSettingsSection } from "../components/settings/MobileSettingsSection";
import { MobileGitHubSettings } from "../components/settings/MobileGitHubSettings";
export const MobileSettings = () => {
    return (_jsxs("div", { className: "space-y-6 pb-8", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Settings" }), _jsx(MobileSettingsSection, { title: "GitHub Integration", icon: "github", description: "Manage your GitHub connection and repository preferences", children: _jsx(MobileGitHubSettings, {}) }), _jsx(MobileSettingsSection, { title: "Account", icon: "user", description: "Manage your account settings and preferences", children: _jsx("div", { className: "p-4 rounded-lg bg-dark-lighter/30 text-sm text-muted-foreground", children: "Account settings coming soon" }) }), _jsx(MobileSettingsSection, { title: "Appearance", icon: "palette", description: "Customize the app's appearance", children: _jsx("div", { className: "p-4 rounded-lg bg-dark-lighter/30 text-sm text-muted-foreground", children: "Appearance settings coming soon" }) })] }));
};
