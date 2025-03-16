
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { useRoleStore } from '@/stores/role';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Coins, UserCheck, Settings } from 'lucide-react';

export function TokenControlPanel() {
  const { 
    tokenBalance, 
    isTokenEnforcementEnabled, 
    enforcementMode,
    toggleTokenEnforcement,
    setEnforcementMode,
    addTokens,
    setTokenBalance,
    isLoading
  } = useTokenManagement();
  
  const { hasRole } = useRoleStore();
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isSuperAdmin = hasRole('super_admin');
  
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle updating another user's token balance (admin only)
  const handleUpdateUserTokens = async () => {
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
          <CardDescription>You have {tokenBalance} tokens available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Contact an administrator to get more tokens.
          </p>
        </CardContent>
      </Card>
    );
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
            
            <TabsContent value="enforcement" className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-1">
                  <Label htmlFor="token-enforcement">Token Enforcement</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, users must have tokens to use AI features
                  </p>
                </div>
                <Switch
                  id="token-enforcement"
                  checked={isTokenEnforcementEnabled}
                  onCheckedChange={toggleTokenEnforcement}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enforcement-mode">Enforcement Mode</Label>
                <Select
                  disabled={!isTokenEnforcementEnabled || isSubmitting}
                  value={enforcementMode}
                  onValueChange={(value) => handleUpdateEnforcementConfig(value as TokenEnforcementMode)}
                >
                  <SelectTrigger id="enforcement-mode">
                    <SelectValue placeholder="Select enforcement mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always (All users)</SelectItem>
                    <SelectItem value="never">Never (Testing only)</SelectItem>
                    <SelectItem value="role_based">Role-based (By user role)</SelectItem>
                    <SelectItem value="mode_based">Mode-based (By chat mode)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Determines how token enforcement is applied across the system
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-id">User ID</Label>
                <Input 
                  id="user-id" 
                  placeholder="Enter user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token-amount">Token Amount</Label>
                <Input 
                  id="token-amount" 
                  type="number"
                  min="0"
                  placeholder="Enter token amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleUpdateUserTokens}
                disabled={!userId || !amount || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Update User Tokens</>
                )}
              </Button>
            </TabsContent>
            
            {isSuperAdmin && (
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="self-tokens">Your Token Balance</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="self-tokens" 
                      type="number"
                      value={tokenBalance.toString()}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      onClick={() => addTokens(100)}
                      disabled={isSubmitting}
                    >
                      Add 100
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>System Test Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, tokens will not be spent in development
                    </p>
                  </div>
                  <Switch
                    checked={enforcementMode === 'never'}
                    onCheckedChange={(checked) => 
                      handleUpdateEnforcementConfig(checked ? 'never' : 'always')
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
