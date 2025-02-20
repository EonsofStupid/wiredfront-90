
import { APIType } from "@/types/admin/settings/api-configuration";
import { ServiceCard } from "./components/ServiceCard";
import { toast } from "sonner";

export function RAGKeysSettings() {
  const handleSaveConfig = async (type: APIType, config: { name: string; key: string }) => {
    try {
      // Implementation of save logic
      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
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
          isConnecting={false}
          selectedConfig={null}
          newConfig={{ name: '', key: '' }}
          onConfigChange={() => {}}
        />
      </div>
    </div>
  );
}
