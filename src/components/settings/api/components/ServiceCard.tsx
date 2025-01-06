import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { APIType } from "@/types/store/settings/api-config";

interface ServiceCardProps {
  type: APIType;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
  configurations: any[];
  newConfig: {
    name: string;
    key: string;
    assistantId?: string;
  };
  isConnecting: boolean;
  selectedConfig: string | null;
  onConnect: (configId: string) => void;
  onConfigChange: (type: APIType, field: string, value: string) => void;
  onSaveConfig: (type: APIType) => void;
}

export function ServiceCard({
  type,
  title,
  description,
  docsUrl,
  docsText,
  placeholder,
  configurations,
  newConfig,
  isConnecting,
  selectedConfig,
  onConnect,
  onConfigChange,
  onSaveConfig,
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configurations.map((config) => (
          <div key={config.id} className="space-y-2 border-b pb-4">
            <div className="flex items-center justify-between">
              <Label>{config.assistant_name}</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConnect(config.id)}
                disabled={isConnecting && selectedConfig === config.id}
              >
                {isConnecting && selectedConfig === config.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
            {config.assistant_id && (
              <div className="text-sm text-muted-foreground">
                Assistant ID: {config.assistant_id}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Status: {config.validation_status}
            </div>
          </div>
        ))}

        <div className="space-y-2 pt-4">
          <Label>Add New Configuration</Label>
          <div className="space-y-2">
            <Input
              placeholder="Configuration Name"
              value={newConfig.name}
              onChange={(e) => onConfigChange(type, 'name', e.target.value)}
            />
            <Input
              type="password"
              placeholder={placeholder}
              value={newConfig.key}
              onChange={(e) => onConfigChange(type, 'key', e.target.value)}
            />
            <Input
              placeholder="Assistant ID (optional)"
              value={newConfig.assistantId}
              onChange={(e) => onConfigChange(type, 'assistantId', e.target.value)}
            />
            <Button 
              onClick={() => onSaveConfig(type)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Get your API key from the{" "}
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {docsText}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}