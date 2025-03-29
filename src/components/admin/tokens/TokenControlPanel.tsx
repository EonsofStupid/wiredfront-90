
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenStore } from '@/stores/token';
import { useRoleStore } from '@/stores/role';
import { TokenEnforcementMode } from '@/components/chat/types/chat/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coins } from 'lucide-react';
import { EnforcementTab } from './tabs/EnforcementTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { UserTokenCard } from './UserTokenCard';

export function TokenControlPanel() {
  const { 
    balance, 
    enforcementMode,
    isEnforcementEnabled,
    setEnforcementMode,
    setEnforcementEnabled,
    addTokens
  } = useTokenStore();
  
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
      await supabase.from('token_transactions').insert({
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
      setEnforcementMode(mode);
      
      // For admin users, also update the global setting
      if (isAdmin) {
        const { error } = await supabase
          .from('feature_flags')
          .upsert({
            key: 'token_enforcement',
            name: 'Token Enforcement',
            description: 'Controls whether token limits are enforced for users',
            enabled: mode !== TokenEnforcementMode.None && mode !== TokenEnforcementMode.Never,
            rollout_percentage: 100,
            metadata: {
              mode: mode,
              updated_by: (await supabase.auth.getUser()).data.user?.id,
              updated_at: new Date().toISOString()
            }
          });
        
        if (error) throw error;
      }
      
      toast.success('Token enforcement settings updated');
    } catch (error) {
      console.error('Error updating enforcement config:', error);
      toast.error('Failed to update token enforcement settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle token enforcement on/off
  const toggleTokenEnforcement = () => {
    const newState = !isEnforcementEnabled;
    setEnforcementEnabled(newState);
    
    // Update the global setting for admins
    if (isAdmin) {
      supabase
        .from('feature_flags')
        .upsert({
          key: 'token_enforcement',
          name: 'Token Enforcement',
          description: 'Controls whether token limits are enforced for users',
          enabled: newState,
          rollout_percentage: 100,
          metadata: {
            mode: newState ? enforcementMode : TokenEnforcementMode.None,
            updated_by: (supabase.auth.getUser() as any).data?.user?.id,
            updated_at: new Date().toISOString()
          }
        })
        .then(({ error }) => {
          if (error) {
            console.error('Error updating feature flag:', error);
            toast.error('Failed to update token enforcement setting');
          }
        });
    }
  };
  
  // Add tokens to current user
  const handleAddTokens = async (amount: number) => {
    setIsSubmitting(true);
    try {
      await addTokens(amount, "admin_action");
      toast.success(`Added ${amount} tokens to your account`);
    } catch (error) {
      console.error('Error adding tokens:', error);
      toast.error('Failed to add tokens');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="mr-2 h-6 w-6 text-yellow-500" />
          Token Management
        </CardTitle>
        <CardDescription>
          Configure token settings and manage user balances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <UserTokenCard 
            balance={balance} 
            onAddTokens={handleAddTokens} 
            isSubmitting={isSubmitting}
          />
          
          <Tabs defaultValue="enforcement" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
              {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="enforcement" className="mt-4">
              <EnforcementTab 
                isTokenEnforcementEnabled={isEnforcementEnabled}
                enforcementMode={enforcementMode}
                toggleTokenEnforcement={toggleTokenEnforcement}
                handleUpdateEnforcementConfig={handleUpdateEnforcementConfig}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="users" className="mt-4">
                <UserManagementTab 
                  handleUpdateUserTokens={handleUpdateUserTokens}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            )}
            
            <TabsContent value="advanced" className="mt-4">
              <AdvancedTab 
                tokenBalance={balance}
                enforcementMode={enforcementMode}
                addTokens={handleAddTokens}
                handleUpdateEnforcementConfig={handleUpdateEnforcementConfig}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
