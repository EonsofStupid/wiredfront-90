
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceProviderConfig } from "../../types/service-config.types";
import { useState } from "react";

interface ServiceConfigurationFormProps {
  provider: ServiceProviderConfig;
}

export function ServiceConfigurationForm({ provider }: ServiceConfigurationFormProps) {
  const [memorableName, setMemorableName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="memorable-name">Configuration Name</Label>
        <Input
          id="memorable-name"
          placeholder={`${provider.label} Configuration`}
          value={memorableName}
          onChange={(e) => setMemorableName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="Enter your API key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>

      {provider.configurationOptions?.requiresEndpoint && (
        <div>
          <Label htmlFor="endpoint">Endpoint URL</Label>
          <Input
            id="endpoint"
            placeholder="https://api.example.com"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Save Configuration
      </Button>
    </form>
  );
}
