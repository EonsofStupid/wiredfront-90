import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, KeyRound, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function PermissionsStep({ selectedRoles, onRoleChange, selectedFeatures, onFeatureChange }) {
    const roles = [
        { id: 'super_admin', label: 'Super Admin', description: 'Full administrative access' },
        { id: 'admin', label: 'Admin', description: 'Management access' },
        { id: 'developer', label: 'Developer', description: 'Developer tools access' },
        { id: 'user', label: 'User', description: 'Basic user access' }
    ];
    const features = [
        { id: 'chat', label: 'Chat', description: 'AI chat functionality' },
        { id: 'document_generation', label: 'Document Generation', description: 'Create documents using AI' },
        { id: 'code_analysis', label: 'Code Analysis', description: 'Code review and analysis features' },
        { id: 'rag', label: 'RAG', description: 'Retrieval-augmented generation' },
        { id: 'planning', label: '01 Planning', description: 'Advanced planning with reasoning' },
        { id: 'github_sync', label: 'GitHub Sync', description: 'Synchronize with GitHub repositories' }
    ];
    return (_jsx("div", { className: "space-y-4", children: _jsxs(Tabs, { defaultValue: "roles", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "roles", className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4" }), "Role Assignment"] }), _jsxs(TabsTrigger, { value: "features", className: "flex items-center gap-2", children: [_jsx(KeyRound, { className: "h-4 w-4" }), "Feature Binding"] })] }), _jsx(TabsContent, { value: "roles", className: "space-y-4 pt-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-base", children: "Assign to Roles" }), _jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Select which roles will have access to this API key" }), _jsx("div", { className: "space-y-3", children: roles.map(role => (_jsxs("div", { className: "flex items-center justify-between space-x-2 border p-3 rounded-md", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(User, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: role.label }), _jsx("p", { className: "text-xs text-muted-foreground", children: role.description })] })] }), _jsx(Switch, { id: `role-${role.id}`, checked: selectedRoles.includes(role.id), onCheckedChange: (checked) => onRoleChange(role.id, checked) })] }, role.id))) }), selectedRoles.length > 0 && (_jsxs("div", { className: "mt-3 flex flex-wrap gap-1", children: [_jsx("span", { className: "text-xs text-muted-foreground mr-2", children: "Assigned to:" }), selectedRoles.map(role => (_jsx(Badge, { variant: "outline", className: "capitalize", children: role.replace('_', ' ') }, role)))] }))] }) }), _jsx(TabsContent, { value: "features", className: "space-y-4 pt-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-base", children: "Bind to Features" }), _jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Select which features will use this API key" }), _jsx("div", { className: "space-y-3", children: features.map(feature => (_jsxs("div", { className: "flex items-center justify-between space-x-2 border p-3 rounded-md", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Server, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: feature.label }), _jsx("p", { className: "text-xs text-muted-foreground", children: feature.description })] })] }), _jsx(Switch, { id: `feature-${feature.id}`, checked: selectedFeatures.includes(feature.id), onCheckedChange: (checked) => onFeatureChange(feature.id, checked) })] }, feature.id))) }), selectedFeatures.length > 0 && (_jsxs("div", { className: "mt-3 flex flex-wrap gap-1", children: [_jsx("span", { className: "text-xs text-muted-foreground mr-2", children: "Assigned to:" }), selectedFeatures.map(feature => (_jsx(Badge, { variant: "outline", className: "capitalize", children: feature.replace('_', ' ') }, feature)))] }))] }) })] }) }));
}
