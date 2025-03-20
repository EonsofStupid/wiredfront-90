import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Key, Plus } from "lucide-react";
export function APIKeyHeader({ onAddKey }) {
    return (_jsxs("div", { className: "flex justify-between items-center pb-4 border-b border-gray-800", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-medium text-xl flex items-center text-white", children: [_jsx(Key, { className: "w-6 h-6 mr-2 text-indigo-400" }), "API Configurations"] }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Manage your API keys and configurations for different services" })] }), _jsxs(Button, { className: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all", onClick: onAddKey, children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add New API Key"] })] }));
}
