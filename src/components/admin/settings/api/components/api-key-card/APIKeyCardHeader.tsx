
import { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Star, 
  Github, 
  Shield,
  CalendarDays 
} from "lucide-react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIType } from "@/types/admin/settings/api";
import { useAPIKeyCardActions } from "./hooks/useAPIKeyCardActions";
import { useRoleStore } from "@/stores/role";
import { format } from "date-fns";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { KeyBadge } from "./KeyBadge";
import { KeyActions } from "./KeyActions";

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
              <KeyBadge type={config.api_type} />
              
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
                          <CalendarDays className="h-3 w-3 mr-1" />
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
        
        <KeyActions 
          config={config}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
          onValidate={onValidate}
          onDelete={onDelete}
          updatingStatus={updatingStatus}
          handleToggleEnabled={handleToggleEnabled}
          handleSetDefault={handleSetDefault}
        />
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
