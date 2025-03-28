import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { useRoleStore } from '@/stores/role';
import { TokenEnforcementMode, UIEnforcementMode } from '@/types/chat/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coins } from 'lucide-react';
import { EnforcementTab } from './tabs/EnforcementTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { UserTokenCard } from './UserTokenCard';

export function TokenControlPanel() {
  const { 
    tokenBalance, 
    isTokenEnforcementEnabled, 
    enforcementMode,
    toggleTokenEnforcement,
    setEnforcementMode,
    addTokens,
    isLoading
  } = useTokenManagement();
  
  const { hasRole } = useRoleStore();
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isSuperAdmin = hasRole('super_admin');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle updating another user's token balance (admin only)
  const handleUpdateUserTokens = async (userId: string, amount: string) => {
    if (!isAdmin || !userId || !amount) return;
    
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
    } catch (error) {
      console.error('Error updating user tokens:', error);
      toast.error('Failed to update user tokens');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle global token enforcement configuration
  const handleUpdateEnforcementConfig = async (mode: TokenEnforcementMode) => {
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
      
      if (error) throw error;
      
      // Update local state
      setEnforcementMode(mode);
      toast.success('Token enforcement configuration updated');
    } catch (error) {
      console.error('Error updating token enforcement config:', error);
      toast.error('Failed to update token configuration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAdmin) {
    return <UserTokenCard tokenBalance={tokenBalance} />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token System Management
          </CardTitle>
          <CardDescription>
            Configure token enforcement and manage user token balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="enforcement" className="space-y-4">
            <TabsList>
              <TabsTrigger value="enforcement">System Settings</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              {isSuperAdmin && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="enforcement">
              <EnforcementTab 
                isTokenEnforcementEnabled={isTokenEnforcementEnabled}
                enforcementMode={enforcementMode}
                toggleTokenEnforcement={toggleTokenEnforcement}
                handleUpdateEnforcementConfig={handleUpdateEnforcementConfig}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagementTab 
                isSubmitting={isSubmitting}
                onUpdateUserTokens={handleUpdateUserTokens}
              />
            </TabsContent>
            
            {isSuperAdmin && (
              <TabsContent value="advanced">
                <AdvancedTab 
                  tokenBalance={tokenBalance}
                  enforcementMode={enforcementMode}
                  addTokens={addTokens}
                  handleUpdateEnforcementConfig={handleUpdateEnforcementConfig}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
