
import { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, AlertCircle, RefreshCw, Trash2, Star, Github } from "lucide-react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIType } from "@/types/admin/settings/api";
import { useAPIKeyCardActions } from "./hooks/useAPIKeyCardActions";

interface APIKeyCardHeaderProps {
  config: APIConfiguration;
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function APIKeyCardHeader({ 
  config, 
  onValidate, 
  onDelete, 
  onRefresh 
}: APIKeyCardHeaderProps) {
  const { handleToggleEnabled, handleSetDefault, updatingStatus } = useAPIKeyCardActions({
    config,
    onRefresh
  });

  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="flex items-center">
            {config.api_type === 'openai' && 'OpenAI'}
            {config.api_type === 'anthropic' && 'Anthropic'}
            {config.api_type === 'gemini' && 'Google Gemini'}
            {config.api_type === 'pinecone' && 'Pinecone'}
            {config.api_type === 'github' && (
              <>
                <Github className="h-4 w-4 mr-1" /> GitHub
              </>
            )}
            
            <div className="ml-3">
              {getValidityBadge(config.validation_status)}
            </div>
            
            {config.is_default && (
              <Badge className="ml-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/30">
                <Star className="h-3 w-3 mr-1" /> Default
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {config.memorable_name}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center mr-2">
            <Switch
              id={`enable-${config.id}`}
              checked={config.is_enabled}
              onCheckedChange={handleToggleEnabled}
              disabled={updatingStatus}
              className="mr-2"
            />
            <span className="text-sm">{config.is_enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onValidate(config.id)}
            className="h-8"
            disabled={updatingStatus}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Validate
          </Button>
          
          {!config.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              className="h-8"
              disabled={updatingStatus}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Set Default
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(config.id)}
            className="h-8"
            disabled={updatingStatus}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}

function getValidityBadge(status: string) {
  if (status === 'valid') {
    return (
      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30">
        <CheckCircle className="h-3 w-3 mr-1" /> Valid
      </Badge>
    );
  } else if (status === 'invalid') {
    return (
      <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30">
        <AlertCircle className="h-3 w-3 mr-1" /> Invalid
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">
        <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Pending
      </Badge>
    );
  }
}
