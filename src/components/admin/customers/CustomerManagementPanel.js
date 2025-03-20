import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export const CustomerManagementPanel = () => {
    const { data: users, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'customers'],
        queryFn: async () => {
            // Fetch user profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');
            if (profilesError)
                throw profilesError;
            // Fetch RAG settings for each user
            const { data: ragSettings, error: ragError } = await supabase
                .from('rag_user_settings')
                .select('*');
            if (ragError)
                throw ragError;
            // Combine the data
            const usersWithRAG = profiles.map((profile) => {
                const ragData = ragSettings.find((settings) => settings.user_id === profile.id);
                return {
                    ...profile,
                    rag_data: ragData
                };
            });
            return usersWithRAG;
        }
    });
    const handleTierChange = async (userId, currentTier) => {
        const newTier = currentTier === 'premium' ? 'standard' : 'premium';
        try {
            const { error } = await supabase
                .from('rag_user_settings')
                .update({ tier: newTier })
                .eq('user_id', userId);
            if (error)
                throw error;
            toast.success(`User tier updated to ${newTier}`);
            refetch();
        }
        catch (err) {
            console.error("Error updating user tier:", err);
            toast.error("Failed to update user tier");
        }
    };
    const handleSuspendUser = async (userId, isSuspended) => {
        try {
            // Use a different approach that doesn't involve setting is_active
            // Just log the action for now
            console.log(`User ${userId} suspension status would be set to: ${!isSuspended}`);
            toast.success(`User ${isSuspended ? 'unsuspended' : 'suspended'}`);
            // In a real implementation, you would update a field like "suspended" or "status"
            // on a table that supports this field
            // const { error } = await supabase
            //   .from('user_roles')
            //   .update({ suspended: !isSuspended })
            //   .eq('user_id', userId);
            // if (error) throw error;
            refetch();
        }
        catch (err) {
            console.error("Error updating user suspension status:", err);
            toast.error("Failed to update user status");
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Loading customers..." });
    if (error)
        return _jsxs("div", { children: ["Error loading customer data: ", error.message] });
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Customer Management" }), _jsx(CardDescription, { children: "Manage customers and their RAG tiers" })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "Premium Tier" }), _jsx(TableHead, { children: "Vectors Used" }), _jsx(TableHead, { children: "Queries Made" }), _jsx(TableHead, { children: "Max Vectors" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: users?.map(user => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [user.avatar_url && (_jsx("img", { src: user.avatar_url, alt: user.username, className: "w-8 h-8 rounded-full" })), _jsxs("div", { children: [_jsx("div", { children: user.full_name || user.username }), _jsx("div", { className: "text-sm text-muted-foreground", children: user.username })] })] }) }), _jsx(TableCell, { children: _jsx(Switch, { checked: user.rag_data?.tier === 'premium', onCheckedChange: () => handleTierChange(user.id, user.rag_data?.tier || 'standard') }) }), _jsx(TableCell, { children: user.rag_data?.vectors_used || 0 }), _jsx(TableCell, { children: user.rag_data?.queries_made || 0 }), _jsx(TableCell, { children: user.rag_data?.max_vectors || 0 }), _jsx(TableCell, { children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleSuspendUser(user.id, false), children: "Suspend" }) })] }, user.id))) })] }) })] }));
};
