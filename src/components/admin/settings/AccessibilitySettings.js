import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";
export function AccessibilitySettings() {
    const preferences = useSettingsStore(state => state.preferences);
    const updatePreferences = useSettingsStore(state => state.updatePreferences);
    const handlePreferenceChange = useCallback((key, value) => {
        updatePreferences({ [key]: value });
    }, [updatePreferences]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Accessibility Settings" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customize your accessibility preferences." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "high-contrast", children: "High Contrast" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Increase contrast for better visibility" })] }), _jsx(Switch, { id: "high-contrast", checked: preferences.highContrast, onCheckedChange: (checked) => handlePreferenceChange('highContrast', checked) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "reduce-motion", children: "Reduce Motion" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Minimize animations and transitions" })] }), _jsx(Switch, { id: "reduce-motion", checked: preferences.reduceMotion, onCheckedChange: (checked) => handlePreferenceChange('reduceMotion', checked) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "large-text", children: "Large Text" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Increase text size for better readability" })] }), _jsx(Switch, { id: "large-text", checked: preferences.largeText, onCheckedChange: (checked) => handlePreferenceChange('largeText', checked) })] })] })] }));
}
