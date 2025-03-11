
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { APIType } from "@/types/admin/settings/api";

interface KeyDetailsStepProps {
  selectedProvider: APIType;
  onProviderChange: (value: string) => void;
  keyName: string;
  onKeyNameChange: (value: string) => void;
  keyValue: string;
  onKeyValueChange: (value: string) => void;
}

export function KeyDetailsStep({
  selectedProvider,
  onProviderChange,
  keyName,
  onKeyNameChange,
  keyValue,
  onKeyValueChange
}: KeyDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiProvider">API Provider</Label>
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger id="apiProvider">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="pinecone">Pinecone</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memorableName">Memorable Name</Label>
        <Input
          id="memorableName"
          value={keyName}
          onChange={(e) => onKeyNameChange(e.target.value)}
          placeholder="e.g., production_main_key"
        />
        <p className="text-xs text-muted-foreground">
          Give this key a memorable name for easy reference
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={keyValue}
          onChange={(e) => onKeyValueChange(e.target.value)}
          placeholder={
            selectedProvider === 'openai' ? 'sk-...' :
            selectedProvider === 'anthropic' ? 'sk-ant-...' :
            selectedProvider === 'gemini' ? 'AIza...' :
            selectedProvider === 'pinecone' ? 'PINE-...' :
            selectedProvider === 'github' ? 'ghp_...' :
            'Enter your API key'
          }
        />
        <p className="text-xs text-muted-foreground flex items-center">
          <Info className="h-3 w-3 mr-1" /> 
          This key will be encrypted and stored securely
        </p>
      </div>
    </div>
  );
}
