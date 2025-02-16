
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIProviderList } from "../providers/ai";
import { VectorStoreList } from "../providers/vector";

export function APISettingsTabs() {
  return (
    <div className="glass-card p-6">
      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-transparent">
          <TabsTrigger 
            value="ai"
            className="data-[state=active]:neon-border data-[state=active]:text-neon-blue"
          >
            AI Services
          </TabsTrigger>
          <TabsTrigger 
            value="vector"
            className="data-[state=active]:neon-border data-[state=active]:text-neon-pink"
          >
            Vector DB
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="ai" className="space-y-4">
            <AIProviderList />
          </TabsContent>
          
          <TabsContent value="vector" className="space-y-4">
            <VectorStoreList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
