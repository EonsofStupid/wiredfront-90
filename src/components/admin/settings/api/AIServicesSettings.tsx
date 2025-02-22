
import { useState } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { APIType } from "@/types/admin/settings/api-configuration";
import { toast } from "sonner";

export function AIServicesSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [newConfig, setNewConfig] = useState({ name: '', key: '' });
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    setNewConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = async (type: APIType, config: { name: string; key: string }) => {
    try {
      setIsConnecting(true);
      // Implementation of save logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success(`${type} configuration saved successfully`);
      setNewConfig({ name: '', key: '' });
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">AI Services Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI service connections.
        </p>
      </div>

      <div className="grid gap-6">
        <ServiceCard
          type="openai"
          title="OpenAI"
          description="Configure OpenAI API access"
          docsUrl="https://platform.openai.com/docs/api-reference"
          docsText="OpenAI documentation"
          placeholder="sk-..."
          onSaveConfig={handleSaveConfig}
          isConnecting={isConnecting}
          selectedConfig={selectedConfig}
          newConfig={newConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
    </div>
  );
}
