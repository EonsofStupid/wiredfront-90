
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

interface UserRAGData {
  id: string;
  user_id: string;
  tier: string;
  vectors_used: number;
  queries_made: number;
  max_vectors: number;
  created_at: string;
  updated_at: string;
}

interface UserWithRAGData extends UserProfile {
  rag_data?: UserRAGData;
}

export const CustomerManagementPanel = () => {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async (): Promise<UserWithRAGData[]> => {
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch RAG settings for each user
      const { data: ragSettings, error: ragError } = await supabase
        .from('rag_user_settings')
        .select('*');

      if (ragError) throw ragError;

      // Combine the data
      const usersWithRAG = profiles.map((profile: UserProfile) => {
        const ragData = ragSettings.find(
          (settings: any) => settings.user_id === profile.id
        );
        return {
          ...profile,
          rag_data: ragData
        };
      });

      return usersWithRAG;
    }
  });

  const handleTierChange = async (userId: string, currentTier: string) => {
    const newTier = currentTier === 'premium' ? 'standard' : 'premium';
    
    try {
      const { error } = await supabase
        .from('rag_user_settings')
        .update({ tier: newTier })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast.success(`User tier updated to ${newTier}`);
      refetch();
    } catch (err) {
      console.error("Error updating user tier:", err);
      toast.error("Failed to update user tier");
    }
  };

  const handleSuspendUser = async (userId: string, isSuspended: boolean) => {
    try {
      // This is a placeholder - actual implementation would depend on how you track user suspension
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: isSuspended ? true : false })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast.success(`User ${isSuspended ? 'unsuspended' : 'suspended'}`);
      refetch();
    } catch (err) {
      console.error("Error updating user suspension status:", err);
      toast.error("Failed to update user status");
    }
  };

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Error loading customer data: {(error as Error).message}</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
        <CardDescription>Manage customers and their RAG tiers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Premium Tier</TableHead>
              <TableHead>Vectors Used</TableHead>
              <TableHead>Queries Made</TableHead>
              <TableHead>Max Vectors</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url && (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div>{user.full_name || user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={user.rag_data?.tier === 'premium'}
                    onCheckedChange={() => handleTierChange(user.id, user.rag_data?.tier || 'standard')}
                  />
                </TableCell>
                <TableCell>{user.rag_data?.vectors_used || 0}</TableCell>
                <TableCell>{user.rag_data?.queries_made || 0}</TableCell>
                <TableCell>{user.rag_data?.max_vectors || 0}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSuspendUser(user.id, false)}
                  >
                    Suspend
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
