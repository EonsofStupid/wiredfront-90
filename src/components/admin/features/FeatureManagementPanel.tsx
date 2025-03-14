
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RAGSettings {
  id: string;
  tier: string;
  max_vectors: number;
  allow_pinecone?: boolean;
}

export const FeatureManagementPanel = () => {
  const [isPineconeEnabled, setIsPineconeEnabled] = useState(false);
  const [standardVectorLimit, setStandardVectorLimit] = useState(10000);
  const [premiumVectorLimit, setPremiumVectorLimit] = useState(500000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'rag-settings'],
    queryFn: async (): Promise<RAGSettings[]> => {
      const { data, error } = await supabase
        .from('rag_user_settings')
        .select('id, tier, max_vectors')
        .order('tier', { ascending: true });

      if (error) throw error;
      
      // Create mock data for Pinecone toggle if it doesn't exist in your DB yet
      const pineconeEnabled = await getPineconeStatus();
      setIsPineconeEnabled(pineconeEnabled);
      
      // Update state values from fetched data
      const standardTier = data.find(s => s.tier === 'standard');
      const premiumTier = data.find(s => s.tier === 'premium');
      
      if (standardTier) setStandardVectorLimit(standardTier.max_vectors);
      if (premiumTier) setPremiumVectorLimit(premiumTier.max_vectors);
      
      return data;
    }
  });

  // This would fetch the actual Pinecone status from your database
  const getPineconeStatus = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'pinecone_enabled')
        .single();
        
      if (error) return false;
      
      // Safely check if enabled property exists in the value
      if (data?.value && typeof data.value === 'object') {
        return (data.value as any).enabled === true;
      }
      
      return false;
    } catch (e) {
      console.error("Error fetching Pinecone status:", e);
      return false;
    }
  };

  const togglePinecone = async () => {
    try {
      const newValue = !isPineconeEnabled;
      
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          key: 'pinecone_enabled',
          value: { enabled: newValue },
          name: 'Pinecone Integration',
          category: 'rag'
        });
        
      if (error) throw error;
      
      setIsPineconeEnabled(newValue);
      toast.success(`Pinecone integration ${newValue ? 'enabled' : 'disabled'}`);
    } catch (e) {
      console.error("Error toggling Pinecone:", e);
      toast.error("Failed to update Pinecone settings");
    }
  };

  const updateVectorLimits = async () => {
    setIsSubmitting(true);
    
    try {
      // Update standard tier
      const { error: standardError } = await supabase
        .from('rag_user_settings')
        .update({ max_vectors: standardVectorLimit })
        .eq('tier', 'standard');
        
      if (standardError) throw standardError;
      
      // Update premium tier
      const { error: premiumError } = await supabase
        .from('rag_user_settings')
        .update({ max_vectors: premiumVectorLimit })
        .eq('tier', 'premium');
        
      if (premiumError) throw premiumError;
      
      toast.success("Vector limits updated successfully");
      refetch();
    } catch (e) {
      console.error("Error updating vector limits:", e);
      toast.error("Failed to update vector limits");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading feature management...</div>;
  if (error) return <div>Error loading feature data: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RAG Storage Limits</CardTitle>
          <CardDescription>Configure vector storage limits for different tiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="standard-limit">Standard Tier Vector Limit</Label>
            <Input
              id="standard-limit"
              type="number"
              value={standardVectorLimit}
              onChange={(e) => setStandardVectorLimit(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="premium-limit">Premium Tier Vector Limit</Label>
            <Input
              id="premium-limit" 
              type="number"
              value={premiumVectorLimit}
              onChange={(e) => setPremiumVectorLimit(parseInt(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={updateVectorLimits} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Limits"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Premium Features</CardTitle>
          <CardDescription>Enable or disable premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Pinecone Integration</Label>
              <p className="text-sm text-muted-foreground">
                Enable Pinecone for premium users
              </p>
            </div>
            <Switch
              checked={isPineconeEnabled}
              onCheckedChange={togglePinecone}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
