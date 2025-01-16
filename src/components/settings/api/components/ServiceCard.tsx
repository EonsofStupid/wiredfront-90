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
    endpoint_url?: string;
    grpc_endpoint?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
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
  const isVectorDB = type === 'weaviate' || type === 'pinecone';

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
              <Label>{config.assistant_name || config.provider_settings?.name || 'Unnamed Configuration'}</Label>
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
            {config.provider_settings && (
              <div className="text-sm text-muted-foreground space-y-1">
                {config.provider_settings.endpoint_url && (
                  <div>Endpoint: {config.provider_settings.endpoint_url}</div>
                )}
                {config.provider_settings.environment && (
                  <div>Environment: {config.provider_settings.environment}</div>
                )}
                {config.provider_settings.index_name && (
                  <div>Index: {config.provider_settings.index_name}</div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="space-y-2 pt-4">
          <Label>Add New Configuration</Label>
          <div className="space-y-2">
            {isVectorDB && (
              <>
                {type === 'weaviate' && (
                  <>
                    <Input
                      placeholder="REST Endpoint"
                      value={newConfig.endpoint_url || ''}
                      onChange={(e) => onConfigChange(type, 'endpoint_url', e.target.value)}
                    />
                    <Input
                      placeholder="gRPC Endpoint"
                      value={newConfig.grpc_endpoint || ''}
                      onChange={(e) => onConfigChange(type, 'grpc_endpoint', e.target.value)}
                    />
                  </>
                )}
                {type === 'pinecone' && (
                  <>
                    <Input
                      placeholder="Environment"
                      value={newConfig.environment || ''}
                      onChange={(e) => onConfigChange(type, 'environment', e.target.value)}
                    />
                    <Input
                      placeholder="Index Name"
                      value={newConfig.index_name || ''}
                      onChange={(e) => onConfigChange(type, 'index_name', e.target.value)}
                    />
                  </>
                )}
              </>
            )}
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
            {!isVectorDB && (
              <Input
                placeholder="Assistant ID (optional)"
                value={newConfig.assistantId}
                onChange={(e) => onConfigChange(type, 'assistantId', e.target.value)}
              />
            )}
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