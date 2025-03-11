
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Shield, Key } from "lucide-react";
import { APIType } from "@/types/admin/settings/api";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="apiProvider" className="flex items-center">
          <Shield className="h-4 w-4 mr-2 text-indigo-400" />
          API Provider
        </Label>
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger id="apiProvider" className="bg-slate-900/50 border-gray-700">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-gray-700">
            <SelectItem value="openai" className="hover:bg-slate-800">OpenAI</SelectItem>
            <SelectItem value="anthropic" className="hover:bg-slate-800">Anthropic</SelectItem>
            <SelectItem value="gemini" className="hover:bg-slate-800">Google Gemini</SelectItem>
            <SelectItem value="pinecone" className="hover:bg-slate-800">Pinecone</SelectItem>
            <SelectItem value="github" className="hover:bg-slate-800">GitHub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memorableName" className="flex items-center">
          <Key className="h-4 w-4 mr-2 text-indigo-400" />
          Memorable Name
        </Label>
        <Input
          id="memorableName"
          value={keyName}
          onChange={(e) => onKeyNameChange(e.target.value)}
          placeholder="e.g., production_main_key"
          className="bg-slate-900/50 border-gray-700"
        />
        <p className="text-xs text-muted-foreground">
          Give this key a memorable name for easy reference
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="apiKey" className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-indigo-400" />
            API Key
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-slate-800 p-1 cursor-help">
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Your API key is securely encrypted and stored.
                  <br />
                  It will never be displayed in plain text after saving.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="apiKey"
          type="password"
          value={keyValue}
          onChange={(e) => onKeyValueChange(e.target.value)}
          className="bg-slate-900/50 border-gray-700 font-mono"
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
          <Shield className="h-3 w-3 mr-1 text-green-500" /> 
          This key will be encrypted and stored securely
        </p>
      </div>
    </div>
  );
}
