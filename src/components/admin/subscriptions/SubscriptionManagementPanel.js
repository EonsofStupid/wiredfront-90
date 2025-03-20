import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
export const SubscriptionManagementPanel = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPlan, setNewPlan] = useState("premium");
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: subscriptions, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'subscriptions'],
        queryFn: async () => {
            // Get subscription data
            const { data: subscriptionData, error: subError } = await supabase
                .from('subscriptions')
                .select('*')
                .order('updated_at', { ascending: false });
            if (subError)
                throw subError;
            // Get profile data to map usernames
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, username');
            if (profileError)
                throw profileError;
            // Map usernames to subscriptions
            const subsWithUsernames = subscriptionData.map((sub) => {
                const profile = profiles.find((p) => p.id === sub.user_id);
                return {
                    ...sub,
                    username: profile?.username || sub.user_id.substring(0, 8)
                };
            });
            return subsWithUsernames;
        }
    });
    const updateSubscription = async () => {
        if (!selectedUser || !newPlan)
            return;
        try {
            // Update subscription status
            const { error } = await supabase
                .from('subscriptions')
                .update({
                status: 'active',
                updated_at: new Date().toISOString()
            })
                .eq('user_id', selectedUser);
            if (error)
                throw error;
            // Also update the user's RAG tier with properly typed value
            const { error: ragError } = await supabase
                .from('rag_user_settings')
                .update({ tier: newPlan })
                .eq('user_id', selectedUser);
            if (ragError)
                throw ragError;
            toast.success(`Subscription updated to ${newPlan}`);
            setDialogOpen(false);
            refetch();
        }
        catch (e) {
            console.error("Error updating subscription:", e);
            toast.error("Failed to update subscription");
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return _jsx(Badge, { className: "bg-green-500", children: "Active" });
            case 'past_due':
                return _jsx(Badge, { className: "bg-yellow-500", children: "Past Due" });
            case 'canceled':
                return _jsx(Badge, { className: "bg-red-500", children: "Canceled" });
            case 'trialing':
                return _jsx(Badge, { className: "bg-blue-500", children: "Trial" });
            default:
                return _jsx(Badge, { children: status });
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Loading subscription data..." });
    if (error)
        return _jsxs("div", { children: ["Error loading subscription data: ", error.message] });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Subscription Management" }), _jsx("p", { className: "text-muted-foreground", children: "Monitor and manage user subscriptions" })] }), _jsxs(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Add Subscription" }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Add or Update Subscription" }), _jsx(DialogDescription, { children: "Manually assign a subscription plan to a user" })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx("label", { htmlFor: "user-id", className: "text-right text-sm", children: "User ID" }), _jsx(Input, { id: "user-id", placeholder: "Enter user ID", className: "col-span-3", onChange: (e) => setSelectedUser(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx("label", { htmlFor: "plan", className: "text-right text-sm", children: "Plan" }), _jsxs(Select, { onValueChange: (value) => setNewPlan(value), defaultValue: "premium", children: [_jsx(SelectTrigger, { className: "col-span-3", children: _jsx(SelectValue, { placeholder: "Select plan" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "standard", children: "Standard" }), _jsx(SelectItem, { value: "premium", children: "Premium" })] })] })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: updateSubscription, children: "Save changes" }) })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Active Subscriptions" }), _jsx(CardDescription, { children: "All active and pending subscriptions" })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "Stripe ID" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Current Period End" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: subscriptions?.map(sub => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: sub.username || sub.user_id.substring(0, 8) }), _jsx(TableCell, { children: sub.stripe_subscription_id || "-" }), _jsx(TableCell, { children: getStatusBadge(sub.status) }), _jsx(TableCell, { children: sub.current_period_end
                                                    ? new Date(sub.current_period_end).toLocaleDateString()
                                                    : "-" }), _jsx(TableCell, { children: new Date(sub.created_at).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                                        setSelectedUser(sub.user_id);
                                                        setDialogOpen(true);
                                                    }, children: "Edit" }) })] }, sub.id))) })] }) })] })] }));
};
