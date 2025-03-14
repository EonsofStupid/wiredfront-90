
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface SystemSettings {
  key: string;
  value: any;
  name: string;
  description?: string;
  category: string;
  updated_at: string;
}

export const EnhancedSystemSettingsPanel = () => {
  const [ragEnabled, setRagEnabled] = useState(true);
  const [standardCost, setStandardCost] = useState("0.01");
  const [premiumCost, setPremiumCost] = useState("0.005");
  const [enterpriseCost, setEnterpriseCost] = useState("0.003");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'system-settings'],
    queryFn: async (): Promise<SystemSettings[]> => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('category', 'rag');

      if (error) throw error;
      
      // Set state from fetched data
      const ragEnabledSetting = data.find(s => s.key === 'rag_enabled');
      
      if (ragEnabledSetting?.value && typeof ragEnabledSetting.value === 'object') {
        setRagEnabled((ragEnabledSetting.value as any).enabled === true);
      }
      
      const costSettings = data.filter(s => s.key.includes('cost_per_thousand'));
      costSettings.forEach(setting => {
        if (setting.key === 'standard_cost_per_thousand' && 
            setting.value && typeof setting.value === 'object') {
          setStandardCost((setting.value as any).amount || "0.01");
        }
        if (setting.key === 'premium_cost_per_thousand' && 
            setting.value && typeof setting.value === 'object') {
          setPremiumCost((setting.value as any).amount || "0.005");
        }
        if (setting.key === 'enterprise_cost_per_thousand' && 
            setting.value && typeof setting.value === 'object') {
          setEnterpriseCost((setting.value as any).amount || "0.003");
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
        
      if (ragError) throw ragError;
      
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
          
        if (error) throw error;
      }
      
      toast.success("System settings updated successfully");
      refetch();
    } catch (e) {
      console.error("Error saving system settings:", e);
      toast.error("Failed to update system settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading system settings...</div>;
  if (error) return <div>Error loading system settings: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Enhanced System Settings</h2>
      <p className="text-muted-foreground">
        Configure global RAG settings and cost parameters
      </p>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Control system-wide RAG functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>RAG Service Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle all RAG functionality on or off
                  </p>
                </div>
                <Switch
                  checked={ragEnabled}
                  onCheckedChange={setRagEnabled}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveSettings}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Configuration</CardTitle>
              <CardDescription>
                Set pricing per 1,000 vectors indexed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard-cost">Standard Tier Cost ($)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="standard-cost"
                      value={standardCost}
                      onChange={(e) => setStandardCost(e.target.value)}
                      placeholder="0.01"
                    />
                    <span className="ml-2">per 1,000 vectors</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="premium-cost">Premium Tier Cost ($)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="premium-cost"
                      value={premiumCost}
                      onChange={(e) => setPremiumCost(e.target.value)}
                      placeholder="0.005"
                    />
                    <span className="ml-2">per 1,000 vectors</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="enterprise-cost">Enterprise Tier Cost ($)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="enterprise-cost"
                      value={enterpriseCost}
                      onChange={(e) => setEnterpriseCost(e.target.value)}
                      placeholder="0.003"
                    />
                    <span className="ml-2">per 1,000 vectors</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveSettings}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Pricing"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Operations</CardTitle>
              <CardDescription>
                Perform system maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Reindex Vectors</h3>
                  <p className="text-sm text-muted-foreground">
                    Rebuild the vector index - may take some time
                  </p>
                  <Button className="mt-2" variant="outline">
                    Start Reindexing
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Clear Usage Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Reset all usage counters - use with caution
                  </p>
                  <Button className="mt-2" variant="destructive">
                    Clear Statistics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
