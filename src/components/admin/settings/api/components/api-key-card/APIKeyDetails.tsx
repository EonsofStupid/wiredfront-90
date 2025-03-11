
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { Clock, Code, Server, Shield, Users } from "lucide-react";
import { format } from "date-fns";

interface APIKeyDetailsProps {
  config: APIConfiguration;
}

export function APIKeyDetails({ config }: APIKeyDetailsProps) {
  return (
    <CardContent className="pt-4 space-y-5">
      {/* Key information section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300 flex items-center">
          <Shield className="h-4 w-4 mr-2 text-indigo-400" />
          Key Information
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Memorable Name</p>
            <p className="text-sm font-medium">{config.memorable_name}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Provider</p>
            <p className="text-sm font-medium capitalize">{config.api_type}</p>
          </div>
          
          {config.created_at && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                {format(new Date(config.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
          )}
          
          {config.last_validated && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Last Validated</p>
              <p className="text-sm font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                {format(new Date(config.last_validated), 'MMMM d, yyyy')}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Feature bindings */}
      {config.feature_bindings && config.feature_bindings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center">
            <Code className="h-4 w-4 mr-2 text-indigo-400" />
            Feature Bindings
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {config.feature_bindings.map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-slate-800/50 text-gray-300 hover:bg-slate-700 capitalize"
              >
                {feature.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Role assignments */}
      {config.role_assignments && config.role_assignments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-400" />
            Role Assignments
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {config.role_assignments.map((role, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20 capitalize"
              >
                {role.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Advanced settings */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300 flex items-center">
          <Server className="h-4 w-4 mr-2 text-indigo-400" />
          Advanced Settings
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">RAG Preference</p>
            <p className="text-sm font-medium capitalize">{config.rag_preference || 'Default'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Planning Mode</p>
            <p className="text-sm font-medium capitalize">{config.planning_mode || 'Basic'}</p>
          </div>
        </div>
      </div>
      
      {/* Usage metrics if available */}
      {config.usage_metrics && Object.keys(config.usage_metrics).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Usage Metrics
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            {config.usage_metrics.total_calls !== undefined && (
              <div className="p-3 bg-slate-800/50 rounded-md">
                <p className="text-xs text-gray-400">Total Calls</p>
                <p className="text-lg font-semibold">{config.usage_metrics.total_calls}</p>
              </div>
            )}
            
            {config.usage_metrics.remaining_quota !== undefined && (
              <div className="p-3 bg-slate-800/50 rounded-md">
                <p className="text-xs text-gray-400">Remaining Quota</p>
                <p className="text-lg font-semibold">{config.usage_metrics.remaining_quota}</p>
              </div>
            )}
            
            {config.usage_metrics.last_reset && (
              <div className="p-3 bg-slate-800/50 rounded-md">
                <p className="text-xs text-gray-400">Last Reset</p>
                <p className="text-sm font-medium">
                  {format(new Date(config.usage_metrics.last_reset), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </CardContent>
  );
}
