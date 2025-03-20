import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsContainer } from "../layout/SettingsContainer";
export function GeneralSettingsSection({ preferences, onPreferenceChange }) {
    return (_jsx(SettingsContainer, { title: "General Settings", description: "Configure your general application preferences.", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: "Username" }), _jsx(Input, { id: "username", value: preferences.username, onChange: (e) => onPreferenceChange('username', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "language", children: "Language" }), _jsx(Input, { id: "language", value: preferences.language, onChange: (e) => onPreferenceChange('language', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "timezone", children: "Timezone" }), _jsx(Input, { id: "timezone", value: preferences.timezone, onChange: (e) => onPreferenceChange('timezone', e.target.value) })] })] }) }));
}
