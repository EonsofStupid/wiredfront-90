import { useAPIConfiguration } from "../hooks/useAPIConfiguration";
import { ServiceConfigurationList } from "./service-cards/ServiceConfigurationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function APISettingsContainer() {
  const { configurations, loading, updateConfiguration, deleteConfiguration } = useAPIConfiguration();

  if (loading) {
    return <div>Loading configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API integrations and service configurations.
        </p>
      </div>

      <Tabs defaultValue="ai-services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-services">AI Services</TabsTrigger>
          <TabsTrigger value="vector-stores">Vector Stores</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <ServiceConfigurationList 
            type="ai"
            configurations={configurations.filter(c => ['openai', 'anthropic', 'gemini'].includes(c.api_type))}
          />
        </TabsContent>

        <TabsContent value="vector-stores">
          <ServiceConfigurationList 
            type="vector"
            configurations={configurations.filter(c => ['pinecone', 'weaviate'].includes(c.api_type))}
          />
        </TabsContent>

        {/* Other tabs will be implemented with their specific service cards */}
      </Tabs>
    </div>
  );
}
