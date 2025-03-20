import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function LogsTabs({ activeTab, setActiveTab }) {
    return (_jsx(Tabs, { value: activeTab, onValueChange: setActiveTab, children: _jsxs(TabsList, { className: "mb-4 w-full sm:w-auto", children: [_jsx(TabsTrigger, { value: "all", children: "All Logs" }), _jsx(TabsTrigger, { value: "info", children: "Info" }), _jsx(TabsTrigger, { value: "warn", children: "Warnings" }), _jsx(TabsTrigger, { value: "error", children: "Errors" }), _jsx(TabsTrigger, { value: "debug", children: "Debug" })] }) }));
}
