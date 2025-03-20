import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsContainer } from "./layout/SettingsContainer";
import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";
export function GeneralSettings() {
    const preferences = useSettingsStore(state => state.preferences);
    const updatePreferences = useSettingsStore(state => state.updatePreferences);
    const handlePreferenceChange = useCallback((key, value) => {
        updatePreferences({ [key]: value });
    }, [updatePreferences]);
    return (_jsx(SettingsContainer, { title: "General Settings", description: "Configure your general application preferences.", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: "Username" }), _jsx(Input, { id: "username", value: preferences.username, onChange: (e) => handlePreferenceChange('username', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "language", children: "Language" }), _jsx(Input, { id: "language", value: preferences.language, onChange: (e) => handlePreferenceChange('language', e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "timezone", children: "Timezone" }), _jsx(Input, { id: "timezone", value: preferences.timezone, onChange: (e) => handlePreferenceChange('timezone', e.target.value) })] })] }) }));
}
