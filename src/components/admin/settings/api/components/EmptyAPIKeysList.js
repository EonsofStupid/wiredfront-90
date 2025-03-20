import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Key, Plus } from "lucide-react";
export function EmptyAPIKeysList({ onAddKey }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-700 rounded-lg bg-slate-900/30 text-center", children: [_jsx("div", { className: "rounded-full bg-slate-800 p-4 mb-4", children: _jsx(Key, { className: "h-8 w-8 text-indigo-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-200 mb-2", children: "No API Keys Configured" }), _jsx("p", { className: "text-gray-400 max-w-md mb-6", children: "Add API keys to connect external services like OpenAI, Anthropic, or GitHub to enhance your application's functionality." }), _jsxs(Button, { onClick: onAddKey, className: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Your First API Key"] })] }));
}
