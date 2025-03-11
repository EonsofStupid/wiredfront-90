
import { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, AlertCircle, RefreshCw, Trash2, Star, Github, Shield, Calendar, Calendar, Calendar } from "lucide-react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIType } from "@/types/admin/settings/api";
import { useAPIKeyCardActions } from "./hooks/useAPIKeyCardActions";
import { useRoleStore } from "@/stores/role";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  const { hasRole } = useRoleStore();
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasRole('admin');

  return (
    <CardHeader className="pb-3 border-b border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <CardTitle className="flex items-center text-xl">
              {config.api_type === 'openai' && 'OpenAI'}
              {config.api_type === 'anthropic' && 'Anthropic'}
              {config.api_type === 'gemini' && 'Google Gemini'}
              {config.api_type === 'pinecone' && 'Pinecone'}
              {config.api_type === 'github' && (
                <>
                  <Github className="h-5 w-5 mr-2 text-gray-300" /> GitHub
                </>
              )}
              
              <div className="ml-3 flex space-x-2">
                {getValidityBadge(config.validation_status)}
                
                {config.is_default && (
                  <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30">
                    <Star className="h-3 w-3 mr-1" /> Default
                  </Badge>
                )}
                
                {config.created_at && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="cursor-help">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(config.created_at), 'MMM d, yyyy')}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Created on {format(new Date(config.created_at), 'MMMM d, yyyy')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardTitle>
            <CardDescription className="mt-1 text-gray-400">
              {config.memorable_name}
              {config.last_validated && (
                <span className="ml-2 text-xs text-gray-500">
                  • Last validated: {format(new Date(config.last_validated), 'MMM d, yyyy')}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center mr-2">
            <Switch
              id={`enable-${config.id}`}
              checked={config.is_enabled}
              onCheckedChange={handleToggleEnabled}
              disabled={updatingStatus || (!isSuperAdmin && !isAdmin)}
              className="mr-2"
            />
            <span className="text-sm">{config.is_enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onValidate(config.id)}
            className="h-8 border-gray-700 hover:bg-slate-800"
            disabled={updatingStatus || !isSuperAdmin}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Validate
          </Button>
          
          {!config.is_default && isSuperAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              className="h-8 border-gray-700 hover:bg-slate-800"
              disabled={updatingStatus}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Set Default
            </Button>
          )}
          
          {isSuperAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(config.id)}
              className="h-8"
              disabled={updatingStatus}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}

function getValidityBadge(status: string) {
  if (status === 'valid') {
    return (
      <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30">
        <CheckCircle className="h-3 w-3 mr-1" /> Valid
      </Badge>
    );
  } else if (status === 'invalid') {
    return (
      <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30">
        <AlertCircle className="h-3 w-3 mr-1" /> Invalid
      </Badge>
    );
  } else if (status === 'pending') {
    return (
      <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30">
        <Shield className="h-3 w-3 mr-1" /> Pending
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline">
        {status || 'Unknown'}
      </Badge>
    );
  }
}
