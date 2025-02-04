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
            type="password"
            placeholder={placeholder}
          />
          <Button 
            onClick={() => onSaveConfig(type)}
            className="w-full"
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