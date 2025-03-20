import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
export const EnhancedSystemSettingsPanel = () => {
    const [ragEnabled, setRagEnabled] = useState(true);
    const [standardCost, setStandardCost] = useState("0.01");
    const [premiumCost, setPremiumCost] = useState("0.005");
    const [enterpriseCost, setEnterpriseCost] = useState("0.003");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: settings, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'system-settings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('category', 'rag');
            if (error)
                throw error;
            // Set state from fetched data
            const ragEnabledSetting = data.find(s => s.key === 'rag_enabled');
            if (ragEnabledSetting?.value && typeof ragEnabledSetting.value === 'object') {
                setRagEnabled(ragEnabledSetting.value.enabled === true);
            }
            const costSettings = data.filter(s => s.key.includes('cost_per_thousand'));
            costSettings.forEach(setting => {
                if (setting.key === 'standard_cost_per_thousand' &&
                    setting.value && typeof setting.value === 'object') {
                    setStandardCost(setting.value.amount || "0.01");
                }
                if (setting.key === 'premium_cost_per_thousand' &&
                    setting.value && typeof setting.value === 'object') {
                    setPremiumCost(setting.value.amount || "0.005");
                }
                if (setting.key === 'enterprise_cost_per_thousand' &&
                    setting.value && typeof setting.value === 'object') {
                    setEnterpriseCost(setting.value.amount || "0.003");
                }
            });
            return data;
        }
    });
    const saveSettings = async () => {
        setIsSubmitting(true);
        try {
            // Update RAG enabled setting
            const { error: ragError } = await supabase
                .from('admin_settings')
                .upsert({
                key: 'rag_enabled',
                value: { enabled: ragEnabled },
                name: 'RAG Service Enabled',
                category: 'rag',
                description: 'Global toggle for RAG functionality'
            });
            if (ragError)
                throw ragError;
            // Update cost settings
            const costUpdates = [
                {
                    key: 'standard_cost_per_thousand',
                    value: { amount: standardCost },
                    name: 'Standard Tier Cost',
                    category: 'rag',
                    description: 'Cost per 1,000 vectors for standard tier'
                },
                {
                    key: 'premium_cost_per_thousand',
                    value: { amount: premiumCost },
                    name: 'Premium Tier Cost',
                    category: 'rag',
                    description: 'Cost per 1,000 vectors for premium tier'
                },
                {
                    key: 'enterprise_cost_per_thousand',
                    value: { amount: enterpriseCost },
                    name: 'Enterprise Tier Cost',
                    category: 'rag',
                    description: 'Cost per 1,000 vectors for enterprise tier'
                }
            ];
            for (const update of costUpdates) {
                const { error } = await supabase
                    .from('admin_settings')
                    .upsert(update);
                if (error)
                    throw error;
            }
            toast.success("System settings updated successfully");
            refetch();
        }
        catch (e) {
            console.error("Error saving system settings:", e);
            toast.error("Failed to update system settings");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Loading system settings..." });
    if (error)
        return _jsxs("div", { children: ["Error loading system settings: ", error.message] });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Enhanced System Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Configure global RAG settings and cost parameters" }), _jsxs(Tabs, { defaultValue: "general", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "general", children: "General" }), _jsx(TabsTrigger, { value: "pricing", children: "Pricing" }), _jsx(TabsTrigger, { value: "maintenance", children: "Maintenance" })] }), _jsx(TabsContent, { value: "general", className: "space-y-4 pt-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Global Settings" }), _jsx(CardDescription, { children: "Control system-wide RAG functionality" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "RAG Service Enabled" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle all RAG functionality on or off" })] }), _jsx(Switch, { checked: ragEnabled, onCheckedChange: setRagEnabled })] }) }), _jsx(CardFooter, { children: _jsx(Button, { onClick: saveSettings, disabled: isSubmitting, children: isSubmitting ? "Saving..." : "Save Settings" }) })] }) }), _jsx(TabsContent, { value: "pricing", className: "space-y-4 pt-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Cost Configuration" }), _jsx(CardDescription, { children: "Set pricing per 1,000 vectors indexed" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "standard-cost", children: "Standard Tier Cost ($)" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: "$" }), _jsx(Input, { id: "standard-cost", value: standardCost, onChange: (e) => setStandardCost(e.target.value), placeholder: "0.01" }), _jsx("span", { className: "ml-2", children: "per 1,000 vectors" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "premium-cost", children: "Premium Tier Cost ($)" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: "$" }), _jsx(Input, { id: "premium-cost", value: premiumCost, onChange: (e) => setPremiumCost(e.target.value), placeholder: "0.005" }), _jsx("span", { className: "ml-2", children: "per 1,000 vectors" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "enterprise-cost", children: "Enterprise Tier Cost ($)" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-2", children: "$" }), _jsx(Input, { id: "enterprise-cost", value: enterpriseCost, onChange: (e) => setEnterpriseCost(e.target.value), placeholder: "0.003" }), _jsx("span", { className: "ml-2", children: "per 1,000 vectors" })] })] })] }) }), _jsx(CardFooter, { children: _jsx(Button, { onClick: saveSettings, disabled: isSubmitting, children: isSubmitting ? "Saving..." : "Save Pricing" }) })] }) }), _jsx(TabsContent, { value: "maintenance", className: "space-y-4 pt-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Maintenance Operations" }), _jsx(CardDescription, { children: "Perform system maintenance tasks" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Reindex Vectors" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Rebuild the vector index - may take some time" }), _jsx(Button, { className: "mt-2", variant: "outline", children: "Start Reindexing" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Clear Usage Statistics" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Reset all usage counters - use with caution" }), _jsx(Button, { className: "mt-2", variant: "destructive", children: "Clear Statistics" })] })] }) })] }) })] })] }));
};
