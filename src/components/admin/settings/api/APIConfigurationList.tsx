
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Star, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface APIConfiguration {
  id: string;
  api_type: string;
  memorable_name: string;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: string;
  feature_bindings?: string[];
  last_validated?: string;
  provider_settings?: any;
  usage_metrics?: any;
  rag_preference?: string;
  planning_mode?: string;
}

interface APIConfigurationListProps {
  configurations: APIConfiguration[];
  isLoading: boolean;
  onValidate: (configId: string) => void;
  onDelete: (configId: string) => void;
  onRefresh: () => void;
}

export function APIConfigurationList({
  configurations,
  isLoading,
  onValidate,
  onDelete,
  onRefresh
}: APIConfigurationListProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleToggleEnabled = async (config: APIConfiguration) => {
    setUpdatingStatus(config.id);
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({ is_enabled: !config.is_enabled })
        .eq('id', config.id);
      
      if (error) throw error;
      
      toast.success(`API key ${!config.is_enabled ? 'enabled' : 'disabled'}`);
      onRefresh();
    } catch (error) {
      console.error('Error updating API configuration:', error);
      toast.error("Failed to update API configuration");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSetDefault = async (config: APIConfiguration) => {
    if (config.is_default) return; // Already default
    
    setUpdatingStatus(config.id);
    try {
      // First, unset any existing defaults for this API type
      const { error: updateError1 } = await supabase
        .from('api_configurations')
        .update({ is_default: false })
        .eq('api_type', config.api_type)
        .eq('is_default', true);
      
      if (updateError1) throw updateError1;
      
      // Then set this one as default
      const { error: updateError2 } = await supabase
        .from('api_configurations')
        .update({ is_default: true })
        .eq('id', config.id);
      
      if (updateError2) throw updateError2;
      
      toast.success(`Set as default ${config.api_type} configuration`);
      onRefresh();
    } catch (error) {
      console.error('Error setting default API configuration:', error);
      toast.error("Failed to set default configuration");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getValidityBadge = (status: string) => {
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
  };

  if (configurations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {configurations.map((config) => (
        <Card key={config.id} className={`overflow-hidden transition-all duration-200 ${!config.is_enabled ? 'opacity-70' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  {config.api_type === 'openai' && 'OpenAI'}
                  {config.api_type === 'anthropic' && 'Anthropic'}
                  {config.api_type === 'gemini' && 'Google Gemini'}
                  {config.api_type === 'pinecone' && 'Pinecone'}
                  
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
                    onCheckedChange={() => handleToggleEnabled(config)}
                    disabled={updatingStatus === config.id}
                    className="mr-2"
                  />
                  <span className="text-sm">{config.is_enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onValidate(config.id)}
                  className="h-8"
                  disabled={updatingStatus === config.id}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Validate
                </Button>
                
                {!config.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(config)}
                    className="h-8"
                    disabled={updatingStatus === config.id}
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
                  disabled={updatingStatus === config.id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1">Features</div>
                <div className="flex flex-wrap gap-1">
                  {config.feature_bindings && config.feature_bindings.length > 0 ? (
                    config.feature_bindings.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="capitalize">
                        {feature.replace('_', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No features assigned</span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Settings</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">RAG:</span>
                    <Badge variant="secondary" className="capitalize">
                      {config.rag_preference || 'supabase'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Planning:</span>
                    <Badge variant="secondary" className="capitalize">
                      {config.planning_mode || 'basic'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {config.usage_metrics && (
              <div className="mt-4 pt-4 border-t">
                <div className="font-medium mb-2">Usage Metrics</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex flex-col p-2 bg-muted/30 rounded-md">
                    <span className="text-muted-foreground">Total Calls</span>
                    <span className="font-medium text-sm">{config.usage_metrics.total_calls || 0}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-muted/30 rounded-md">
                    <span className="text-muted-foreground">Monthly Usage</span>
                    <span className="font-medium text-sm">{config.usage_metrics.monthly_usage || 0}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-muted/30 rounded-md">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium text-sm">{config.usage_metrics.remaining_quota || 'Unlimited'}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/40 border-t">
            <div className="w-full text-xs text-muted-foreground flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                Last validated: {config.last_validated 
                  ? new Date(config.last_validated).toLocaleString() 
                  : 'Never'}
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                View Details <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
