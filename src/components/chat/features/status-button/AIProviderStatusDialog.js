import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, CloudOff } from 'lucide-react';
export function AIProviderStatusDialog({ open, onOpenChange, providers, currentProvider }) {
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "chat-glass-card border-0 max-w-[500px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-xl font-bold text-white", children: "AI Provider Status" }) }), _jsx(ScrollArea, { className: "max-h-[60vh] px-1", children: _jsx("div", { className: "space-y-4 my-4", children: providers.length === 0 ? (_jsxs("div", { className: "p-8 text-center rounded-lg border border-white/10 bg-black/20", children: [_jsx(CloudOff, { className: "h-10 w-10 mx-auto text-white/40 mb-3" }), _jsx("h3", { className: "text-lg font-medium text-white", children: "No Providers Available" }), _jsx("p", { className: "text-sm text-white/60 mt-2", children: "No AI providers have been configured yet. Set up your API keys in settings." })] })) : (providers.map(provider => (_jsx(ProviderStatusCard, { provider: provider, isActive: currentProvider?.id === provider.id }, provider.id)))) }) })] }) }));
}
function ProviderStatusCard({ provider, isActive }) {
    // Mock status for demo - in real app you'd fetch this from the provider's service
    const mockStatuses = [
        'operational', 'degraded', 'outage', 'operational', 'operational', 'degraded'
    ];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
    const getStatusDetails = (status) => {
        switch (status) {
            case 'operational':
                return {
                    label: 'Operational',
                    color: 'text-green-400',
                    bg: 'bg-green-500/20',
                    border: 'border-green-500/30',
                    icon: _jsx(CheckCircle2, { className: "h-5 w-5 text-green-400" })
                };
            case 'degraded':
                return {
                    label: 'Degraded',
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500/30',
                    icon: _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-400" })
                };
            case 'outage':
                return {
                    label: 'Outage',
                    color: 'text-red-400',
                    bg: 'bg-red-500/20',
                    border: 'border-red-500/30',
                    icon: _jsx(XCircle, { className: "h-5 w-5 text-red-400" })
                };
            default:
                return {
                    label: 'Unknown',
                    color: 'text-gray-400',
                    bg: 'bg-gray-500/20',
                    border: 'border-gray-500/30',
                    icon: _jsx(AlertTriangle, { className: "h-5 w-5 text-gray-400" })
                };
        }
    };
    const status = getStatusDetails(randomStatus);
    return (_jsx("div", { className: `rounded-lg border ${isActive
            ? 'bg-chat-neon-purple/10 border-chat-neon-purple/30'
            : 'bg-black/20 border-white/10'}`, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h3", { className: "text-md font-medium text-white", children: provider.name }), isActive && (_jsx(Badge, { className: "ml-2 bg-chat-neon-purple/30 text-white text-[10px]", children: "Active" }))] }), _jsx("p", { className: "text-sm text-white/60 mt-1", children: provider.description })] }), _jsxs("div", { className: `flex items-center px-2 py-1 rounded-full ${status.bg} ${status.border}`, children: [status.icon, _jsx("span", { className: `text-xs font-medium ml-1 ${status.color}`, children: status.label })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mt-4", children: [_jsxs("div", { className: "bg-black/30 rounded-md p-2", children: [_jsx("p", { className: "text-xs text-white/50", children: "Supported Models" }), _jsx("p", { className: "text-sm text-white mt-1", children: provider.models.length })] }), _jsxs("div", { className: "bg-black/30 rounded-md p-2", children: [_jsx("p", { className: "text-xs text-white/50", children: "Streaming" }), _jsx("p", { className: "text-sm text-white mt-1", children: provider.supportsStreaming ? 'Supported' : 'Not Supported' })] }), _jsxs("div", { className: "bg-black/30 rounded-md p-2", children: [_jsx("p", { className: "text-xs text-white/50", children: "Cost / 1K Tokens" }), _jsx("p", { className: "text-sm text-white mt-1", children: provider.costPerToken
                                        ? `$${provider.costPerToken.toFixed(4)}`
                                        : 'Not specified' })] }), _jsxs("div", { className: "bg-black/30 rounded-md p-2", children: [_jsx("p", { className: "text-xs text-white/50", children: "Category" }), _jsx("p", { className: "text-sm text-white mt-1 capitalize", children: provider.category })] })] })] }) }));
}
