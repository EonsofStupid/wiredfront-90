
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  stripe_subscription_id: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  username?: string; // Joined from profiles
}

export const SubscriptionManagementPanel = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<string>("premium");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: subscriptions, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async (): Promise<Subscription[]> => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Format response to include username directly in the object
      return data.map(sub => ({
        ...sub,
        username: sub.profiles?.username
      }));
    }
  });

  const updateSubscription = async () => {
    if (!selectedUser || !newPlan) return;
    
    try {
      // Update subscription status
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', selectedUser);
        
      if (error) throw error;
      
      // Also update the user's RAG tier
      const { error: ragError } = await supabase
        .from('rag_user_settings')
        .update({ tier: newPlan })
        .eq('user_id', selectedUser);
        
      if (ragError) throw ragError;
      
      toast.success(`Subscription updated to ${newPlan}`);
      setDialogOpen(false);
      refetch();
    } catch (e) {
      console.error("Error updating subscription:", e);
      toast.error("Failed to update subscription");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Trial</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) return <div>Loading subscription data...</div>;
  if (error) return <div>Error loading subscription data: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage user subscriptions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Subscription</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add or Update Subscription</DialogTitle>
              <DialogDescription>
                Manually assign a subscription plan to a user
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="user-id" className="text-right text-sm">
                  User ID
                </label>
                <Input
                  id="user-id"
                  placeholder="Enter user ID"
                  className="col-span-3"
                  onChange={(e) => setSelectedUser(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="plan" className="text-right text-sm">
                  Plan
                </label>
                <Select 
                  onValueChange={setNewPlan}
                  defaultValue="premium"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateSubscription}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>
            All active and pending subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Period End</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions?.map(sub => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {sub.username || sub.user_id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{sub.stripe_subscription_id || "-"}</TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell>
                    {sub.current_period_end 
                      ? new Date(sub.current_period_end).toLocaleDateString() 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(sub.user_id);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
