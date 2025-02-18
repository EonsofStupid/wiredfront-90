
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAPIConfigurations } from "@/hooks/admin/settings/useAPIConfigurations";
import { toast } from "sonner";
import { APIType } from "@/types/admin/settings/api-configuration";

export function AIServicesSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();

  const handleSaveConfig = async (type: APIType) => {
    try {
      await createConfiguration(type, {
        memorable_name: `${type}_default`,
        category: 'ai'
      });
      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI</CardTitle>
          <CardDescription>Configure OpenAI API access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="sk-..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anthropic</CardTitle>
          <CardDescription>Configure Anthropic API access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="sk-ant-..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
