
import { useState } from "react";
import { APIType } from "@/types/admin/settings/api-configuration";
import { ServiceCard } from "./components/ServiceCard";
import { toast } from "sonner";

export function RAGKeysSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [newConfig, setNewConfig] = useState({ 
    name: '', 
    key: '', 
    environment: '',
    index_name: '' 
  });
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    setNewConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = async (type: APIType, config: { 
    name: string; 
    key: string;
    environment?: string;
    index_name?: string;
  }) => {
    try {
      setIsConnecting(true);
      // Implementation of save logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success(`${type} configuration saved successfully`);
      setNewConfig({ name: '', key: '', environment: '', index_name: '' });
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
        <h3 className="text-lg font-medium">Vector Database Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your vector database connections for RAG capabilities.
        </p>
      </div>

      <div className="grid gap-6">
        <ServiceCard
          type="pinecone"
          title="Pinecone"
          description="Configure Pinecone vector database"
          docsUrl="https://docs.pinecone.io/docs"
          docsText="Pinecone documentation"
          placeholder="YOUR_API_KEY"
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
