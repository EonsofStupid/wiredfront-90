import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BotIcon, Trash2, Star, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { API_CONFIGURATIONS } from "@/constants/api-configurations";
export function APIConfigurationList({ configurations, onConfigurationChange, onSetDefault, onDelete }) {
    const getConfigForType = (apiType) => {
        return configurations.find(config => config.api_type === apiType);
    };
    return (_jsxs(Tabs, { defaultValue: "openai", className: "space-y-4", children: [_jsx(TabsList, { children: API_CONFIGURATIONS.map((api) => (_jsx(TabsTrigger, { value: api.type, children: api.label }, api.type))) }), API_CONFIGURATIONS.map((api) => {
                const config = getConfigForType(api.type);
                const isConfigured = !!config;
                return (_jsx(TabsContent, { value: api.type, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(BotIcon, { className: "mr-2 h-4 w-4" }), api.label] }), config?.validation_status === 'valid' && (_jsxs(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500/30", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Valid"] })), config?.validation_status === 'invalid' && (_jsxs(Badge, { variant: "outline", className: "bg-red-500/10 text-red-500 border-red-500/30", children: [_jsx(AlertCircle, { className: "h-3 w-3 mr-1" }), "Invalid"] })), config?.validation_status === 'pending' && (_jsxs(Badge, { variant: "outline", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", children: [_jsx(AlertTriangle, { className: "h-3 w-3 mr-1 animate-spin" }), "Pending"] }))] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: api.description }) }), _jsxs(CardFooter, { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: `api-${api.type}`, checked: isConfigured && config.is_enabled, onCheckedChange: (checked) => onConfigurationChange(checked, config, api.type) }), _jsx("label", { htmlFor: `api-${api.type}`, className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: isConfigured ? 'Enabled' : 'Disabled' })] }), _jsxs("div", { className: "flex space-x-2", children: [isConfigured && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => onSetDefault(config.id), disabled: config.is_default, children: [_jsx(Star, { className: "h-3 w-3 mr-2" }), "Set Default"] })), isConfigured && (_jsxs(Button, { variant: "destructive", size: "sm", onClick: () => onDelete(config.id), children: [_jsx(Trash2, { className: "h-3 w-3 mr-2" }), "Delete"] }))] })] })] }) }, api.type));
            })] }));
}
