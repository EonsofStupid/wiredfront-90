import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent, AdminCardFooter } from "@/components/admin/ui/AdminCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, AlertCircle, Save, Trash } from "lucide-react";
import { useRoleStore } from "@/stores/role";
import { toast } from "sonner";
export function ServiceCard({ type, title, description, docsUrl, docsText, placeholder, onSaveConfig, isConnecting, selectedConfig, newConfig, onConfigChange, }) {
    const { hasRole } = useRoleStore();
    const [configStatus, setConfigStatus] = useState('idle');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const canEdit = hasRole('admin') || hasRole('super_admin');
    const canDelete = hasRole('super_admin');
    const handleSaveClick = async () => {
        if (!newConfig.name) {
            setError("Configuration name is required");
            toast.error("Configuration name is required");
            return;
        }
        if (!newConfig.key) {
            setError("API key is required");
            toast.error("API key is required");
            return;
        }
        setConfigStatus('validating');
        setError(null);
        try {
            await onSaveConfig(type, newConfig);
            setConfigStatus('success');
            toast.success(`${title} configuration saved successfully`);
            setTimeout(() => setConfigStatus('idle'), 2000);
        }
        catch (err) {
            setConfigStatus('error');
            const errorMessage = err instanceof Error ? err.message : "Failed to save configuration";
            setError(errorMessage);
            toast.error(`Failed to save ${title} configuration`);
        }
    };
    const handleValidateClick = () => {
        // This would be implemented to validate the API key
        setConfigStatus('validating');
        // Simulating validation
        setTimeout(() => {
            setConfigStatus('success');
            toast.success("API key validated successfully");
            setTimeout(() => setConfigStatus('idle'), 2000);
        }, 1500);
    };
    return (_jsxs(AdminCard, { className: "relative overflow-hidden", requiredRole: isEditing ? "super_admin" : undefined, error: error, children: [_jsxs(AdminCardHeader, { children: [_jsx(AdminCardTitle, { children: title }), _jsx(AdminCardDescription, { children: description })] }), _jsxs(AdminCardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { type: "text", placeholder: "Configuration Name", value: newConfig.name, onChange: (e) => {
                                    onConfigChange(type, 'name', e.target.value);
                                    setError(null);
                                }, className: "bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 mb-2", disabled: !canEdit || isConnecting }), _jsx(Input, { type: "password", placeholder: placeholder, value: newConfig.key, onChange: (e) => {
                                    onConfigChange(type, 'key', e.target.value);
                                    setError(null);
                                }, className: "bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50", disabled: !canEdit || isConnecting }), type === 'pinecone' && (_jsxs(_Fragment, { children: [_jsx(Input, { type: "text", placeholder: "Environment", value: newConfig.environment || '', onChange: (e) => onConfigChange(type, 'environment', e.target.value), className: "bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50", disabled: !canEdit || isConnecting }), _jsx(Input, { type: "text", placeholder: "Index Name", value: newConfig.index_name || '', onChange: (e) => onConfigChange(type, 'index_name', e.target.value), className: "bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50", disabled: !canEdit || isConnecting })] })), _jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [_jsx(Button, { onClick: handleSaveClick, className: "flex-1 min-w-0 admin-primary-button group", disabled: isConnecting || !canEdit || configStatus === 'validating', children: configStatus === 'validating' ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), "Validating..."] })) : configStatus === 'success' ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Check, { className: "h-4 w-4 text-green-300" }), "Saved"] })) : (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Save, { className: "h-4 w-4 transition-transform group-hover:scale-110" }), "Save Configuration"] })) }), canDelete && (_jsx(Button, { variant: "destructive", size: "icon", className: "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30", disabled: isConnecting || !selectedConfig, children: _jsx(Trash, { className: "h-4 w-4" }) }))] })] }), _jsx(AdminCardFooter, { className: "pt-2 border-t border-[#8B5CF6]/20", children: _jsxs("p", { className: "text-sm text-muted-foreground flex items-center", children: [_jsx("span", { children: "Get your API key from the" }), _jsxs("a", { href: docsUrl, target: "_blank", rel: "noopener noreferrer", className: "text-[#8B5CF6] hover:text-[#D946EF] transition-colors ml-1 inline-flex items-center group", children: [docsText, _jsx(ExternalLink, { className: "h-3 w-3 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })] })] }) })] }), _jsx("div", { className: "absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent rounded-bl-full pointer-events-none" }), configStatus === 'success' && (_jsx("div", { className: "absolute top-4 right-4 bg-green-500/20 p-1.5 rounded-full border border-green-500/30", children: _jsx(Check, { className: "h-4 w-4 text-green-500" }) })), configStatus === 'error' && (_jsx("div", { className: "absolute top-4 right-4 bg-red-500/20 p-1.5 rounded-full border border-red-500/30", children: _jsx(AlertCircle, { className: "h-4 w-4 text-red-500" }) }))] }));
}
