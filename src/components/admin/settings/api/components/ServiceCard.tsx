
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceCardProps } from "@/types/admin/settings/api-configuration";

export function ServiceCard({
  type,
  title,
  description,
  docsUrl,
  docsText,
  placeholder,
  onSaveConfig,
  isConnecting,
  selectedConfig,
  newConfig,
  onConfigChange,
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Configuration Name"
            value={newConfig.name}
            onChange={(e) => onConfigChange(type, 'name', e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder={placeholder}
            value={newConfig.key}
            onChange={(e) => onConfigChange(type, 'key', e.target.value)}
          />
          {type === 'pinecone' && (
            <>
              <Input
                type="text"
                placeholder="Environment"
                value={newConfig.environment || ''}
                onChange={(e) => onConfigChange(type, 'environment', e.target.value)}
              />
              <Input
                type="text"
                placeholder="Index Name"
                value={newConfig.index_name || ''}
                onChange={(e) => onConfigChange(type, 'index_name', e.target.value)}
              />
            </>
          )}
          <Button 
            onClick={() => onSaveConfig(type, newConfig)}
            className="w-full"
            disabled={isConnecting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </Button>
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
