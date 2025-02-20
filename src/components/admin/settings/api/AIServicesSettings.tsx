
import { ServiceCard } from "./components/ServiceCard";
import { APIType } from "@/types/admin/settings/api-configuration";
import { toast } from "sonner";

export function AIServicesSettings() {
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
          isConnecting={false}
          selectedConfig={null}
          newConfig={{ name: '', key: '' }}
          onConfigChange={() => {}}
        />
      </div>
    </div>
  );
}
