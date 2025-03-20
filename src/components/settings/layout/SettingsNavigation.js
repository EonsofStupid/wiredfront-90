import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function SettingsNavigation({ tabs, defaultValue = "general", onTabChange }) {
    const handleValueChange = (value) => {
        if (onTabChange) {
            onTabChange(value);
        }
    };
    return (_jsxs(Tabs, { defaultValue: defaultValue, value: defaultValue, onValueChange: handleValueChange, className: "w-full", children: [_jsx(TabsList, { className: "grid grid-cols-6", children: tabs.map((tab) => (_jsx(TabsTrigger, { value: tab.value, children: tab.label }, tab.value))) }), tabs.map((tab) => (_jsx(TabsContent, { value: tab.value, className: "space-y-4", children: _jsx("div", { className: "glass-card p-6", children: tab.content }) }, tab.value)))] }));
}
