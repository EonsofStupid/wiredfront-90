
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { APIConfiguration, APIConfigurationItem, APIConfigurationListProps, APIType } from "@/types/admin/settings/api-configuration";
import { BotIcon, Trash2, Star, Zap, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { API_CONFIGURATIONS } from "@/constants/api-configurations";

export function APIConfigurationList({
  configurations,
  onConfigurationChange,
  onSetDefault,
  onDelete
}: APIConfigurationListProps) {

  const getConfigForType = (apiType: APIType): APIConfiguration | undefined => {
    return configurations.find(config => config.api_type === apiType);
  };

  return (
    <Tabs defaultValue="openai" className="space-y-4">
      <TabsList>
        {API_CONFIGURATIONS.map((api) => (
          <TabsTrigger value={api.type} key={api.type}>
            {api.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {API_CONFIGURATIONS.map((api) => {
        const config = getConfigForType(api.type);
        const isConfigured = !!config;

        return (
          <TabsContent value={api.type} key={api.type}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BotIcon className="mr-2 h-4 w-4" />
                    {api.label}
                  </CardTitle>
                  {config?.validation_status === 'valid' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  )}
                  {config?.validation_status === 'invalid' && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                  {config?.validation_status === 'pending' && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                      <AlertTriangle className="h-3 w-3 mr-1 animate-spin" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {api.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`api-${api.type}`}
                    checked={isConfigured && config.is_enabled}
                    onCheckedChange={(checked) => onConfigurationChange(checked, config, api.type)}
                  />
                  <label
                    htmlFor={`api-${api.type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {isConfigured ? 'Enabled' : 'Disabled'}
                  </label>
                </div>
                <div className="flex space-x-2">
                  {isConfigured && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetDefault(config.id)}
                      disabled={config.is_default}
                    >
                      <Star className="h-3 w-3 mr-2" />
                      Set Default
                    </Button>
                  )}
                  {isConfigured && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(config.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
