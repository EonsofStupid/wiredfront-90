import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AIServicesSectionProps {
  title: string;
  description: string;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  placeholder: string;
  docsUrl: string;
  docsText: string;
}

export function AIServicesSection({
  title,
  description,
  apiKey,
  onApiKeyChange,
  placeholder,
  docsUrl,
  docsText,
}: AIServicesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-key`}>API Key</Label>
          <Input
            id={`${title.toLowerCase()}-key`}
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={placeholder}
          />
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