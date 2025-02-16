
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIProviderList } from "../providers/ai/AIProviderList";
import { VectorStoreList } from "../providers/vector/VectorStoreList";

export function APISettingsTabs() {
  return (
    <Tabs defaultValue="ai" className="space-y-6">
      <TabsList>
        <TabsTrigger value="ai">AI Providers</TabsTrigger>
        <TabsTrigger value="vector">Vector Stores</TabsTrigger>
        <TabsTrigger value="voice">Voice Services</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ai" className="space-y-4">
        <AIProviderList />
      </TabsContent>
      
      <TabsContent value="vector" className="space-y-4">
        <VectorStoreList />
      </TabsContent>
      
      <TabsContent value="voice" className="space-y-4">
        {/* Voice provider list will be implemented later */}
      </TabsContent>
    </Tabs>
  );
}
