import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { useRoleStore } from '@/stores/role';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coins } from 'lucide-react';
import { EnforcementTab } from './tabs/EnforcementTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { UserTokenCard } from './UserTokenCard';
export function TokenControlPanel() {
    const { tokenBalance, isTokenEnforcementEnabled, enforcementMode, toggleTokenEnforcement, setEnforcementMode, addTokens, isLoading } = useTokenManagement();
    const { hasRole } = useRoleStore();
    const isAdmin = hasRole('admin') || hasRole('super_admin');
    const isSuperAdmin = hasRole('super_admin');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Handle updating another user's token balance (admin only)
    const handleUpdateUserTokens = async (userId, amount) => {
        if (!isAdmin || !userId || !amount)
            return;
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('user_tokens')
                .upsert({
                user_id: userId,
                balance: parseInt(amount),
                updated_at: new Date().toISOString()
            })
                .select();
            if (error) {
                throw error;
            }
            // Log the transaction for auditing
            await supabase.from('token_transaction_log').insert({
                user_id: userId,
                amount: parseInt(amount),
                transaction_type: 'admin_update',
                description: 'Updated by administrator',
                metadata: { admin_id: (await supabase.auth.getUser()).data.user?.id }
            });
            toast.success(`Updated tokens for user ${userId}`);
        }
        catch (error) {
            console.error('Error updating user tokens:', error);
            toast.error('Failed to update user tokens');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Handle global token enforcement configuration
    const handleUpdateEnforcementConfig = async (mode) => {
        setIsSubmitting(true);
        try {
            // Update the feature flag for token enforcement
            const { error } = await supabase
                .from('feature_flags')
                .upsert({
                key: 'token_enforcement',
                name: 'Token Enforcement',
                description: 'Controls whether users need tokens to use the API',
                enabled: isTokenEnforcementEnabled,
                metadata: {
                    enforcementMode: mode
                },
                created_by: (await supabase.auth.getUser()).data.user?.id,
                updated_by: (await supabase.auth.getUser()).data.user?.id
            });
            if (error)
                throw error;
            // Update local state
            setEnforcementMode(mode);
            toast.success('Token enforcement configuration updated');
        }
        catch (error) {
            console.error('Error updating token enforcement config:', error);
            toast.error('Failed to update token configuration');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!isAdmin) {
        return _jsx(UserTokenCard, { tokenBalance: tokenBalance });
    }
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Coins, { className: "h-5 w-5" }), "Token System Management"] }), _jsx(CardDescription, { children: "Configure token enforcement and manage user token balances" })] }), _jsx(CardContent, { children: _jsxs(Tabs, { defaultValue: "enforcement", className: "space-y-4", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "enforcement", children: "System Settings" }), _jsx(TabsTrigger, { value: "users", children: "User Management" }), isSuperAdmin && _jsx(TabsTrigger, { value: "advanced", children: "Advanced" })] }), _jsx(TabsContent, { value: "enforcement", children: _jsx(EnforcementTab, { isTokenEnforcementEnabled: isTokenEnforcementEnabled, enforcementMode: enforcementMode, toggleTokenEnforcement: toggleTokenEnforcement, handleUpdateEnforcementConfig: handleUpdateEnforcementConfig, isSubmitting: isSubmitting }) }), _jsx(TabsContent, { value: "users", children: _jsx(UserManagementTab, { isSubmitting: isSubmitting, onUpdateUserTokens: handleUpdateUserTokens }) }), isSuperAdmin && (_jsx(TabsContent, { value: "advanced", children: _jsx(AdvancedTab, { tokenBalance: tokenBalance, enforcementMode: enforcementMode, addTokens: addTokens, handleUpdateEnforcementConfig: handleUpdateEnforcementConfig, isSubmitting: isSubmitting }) }))] }) })] }) }));
}
