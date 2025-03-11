
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Info, Key, Lock, Shield, PlusCircle, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { useRoleStore } from "@/stores/role";
import { Progress } from "@/components/ui/progress";
import { SettingsContainer } from "../layout/SettingsContainer";
import { Badge } from "@/components/ui/badge";
import { APIConfigurationList } from "./APIConfigurationList";

export function APIKeyManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [newKey, setNewKey] = useState({ name: "", key: "", provider: "openai" });
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [ragPreference, setRagPreference] = useState("supabase");
  const [planningMode, setPlanningMode] = useState("basic");
  const { hasRole } = useRoleStore();

  const canManageKeys = hasRole('super_admin');

  useEffect(() => {
    if (canManageKeys) {
      fetchConfigurations();
    }
  }, [canManageKeys]);

  const fetchConfigurations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { action: 'list' }
      });
      
      if (error) throw error;
      
      if (data && data.configurations) {
        setConfigurations(data.configurations);
      }
    } catch (error) {
      console.error('Error fetching API configurations:', error);
      toast.error("Failed to fetch API configurations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKey = async () => {
    if (!newKey.name || !newKey.key) {
      toast.error("Please provide both a name and key");
      return;
    }

    setIsAddingKey(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'create',
          secretValue: newKey.key,
          provider: selectedProvider,
          memorableName: newKey.name,
          settings: {
            feature_bindings: selectedFeatures,
            rag_preference: ragPreference,
            planning_mode: planningMode
          },
          roleBindings: selectedRoles,
          userBindings: []
        }
      });
      
      if (error) throw error;
      
      toast.success("API key saved successfully");
      setNewKey({ name: "", key: "", provider: "openai" });
      setShowAddDialog(false);
      setCurrentStep(1);
      fetchConfigurations();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error("Failed to save API key");
    } finally {
      setIsAddingKey(false);
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (!window.confirm('Are you sure you want to delete this API configuration?')) {
      return;
    }

    setIsLoading(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'delete',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API configuration deleted successfully");
      fetchConfigurations();
    } catch (error) {
      console.error('Error deleting API configuration:', error);
      toast.error("Failed to delete API configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateConfig = async (configId) => {
    setIsLoading(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'validate',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API key validated successfully");
      fetchConfigurations();
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error("Failed to validate API key");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveKey();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!canManageKeys) {
    return (
      <SettingsContainer
        title="API Key Management"
        description="Manage API keys for different services"
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-destructive" />
              Access Restricted
            </CardTitle>
            <CardDescription>
              You don't have permission to manage API keys. This feature is restricted to Super Admin users.
            </CardDescription>
          </CardHeader>
        </Card>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer
      title="API Key Management"
      description="Securely manage API keys for AI services and integrations"
    >
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Configurations
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage your API keys and configurations for different services
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="admin-primary-button">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  {currentStep === 1 && "Enter your API key information"}
                  {currentStep === 2 && "Configure key permissions and assignments"}
                  {currentStep === 3 && "Set up RAG and planning preferences"}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="mb-5">
                  <Progress className="h-2" value={(currentStep / 3) * 100} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span className={currentStep >= 1 ? "text-primary" : ""}>Key Details</span>
                    <span className={currentStep >= 2 ? "text-primary" : ""}>Permissions</span>
                    <span className={currentStep >= 3 ? "text-primary" : ""}>Features</span>
                  </div>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiProvider">API Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger id="apiProvider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                          <SelectItem value="pinecone">Pinecone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="memorableName">Memorable Name</Label>
                      <Input
                        id="memorableName"
                        value={newKey.name}
                        onChange={(e) => setNewKey({...newKey, name: e.target.value})}
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
                        value={newKey.key}
                        onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                        placeholder={
                          selectedProvider === 'openai' ? 'sk-...' :
                          selectedProvider === 'anthropic' ? 'sk-ant-...' :
                          selectedProvider === 'gemini' ? 'AIza...' :
                          selectedProvider === 'pinecone' ? 'PINE-...' :
                          'Enter your API key'
                        }
                      />
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Info className="h-3 w-3 mr-1" /> 
                        This key will be encrypted and stored securely
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Role Assignments</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['super_admin', 'admin', 'developer', 'user'].map(role => (
                          <div className="flex items-center space-x-2" key={role}>
                            <Switch
                              id={`role-${role}`}
                              checked={selectedRoles.includes(role)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRoles([...selectedRoles, role]);
                                } else {
                                  setSelectedRoles(selectedRoles.filter(r => r !== role));
                                }
                              }}
                            />
                            <Label htmlFor={`role-${role}`} className="capitalize">
                              {role.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select which roles will have access to this API key
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Feature Bindings</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['chat', 'document_generation', 'code_analysis', 'rag'].map(feature => (
                          <div className="flex items-center space-x-2" key={feature}>
                            <Switch
                              id={`feature-${feature}`}
                              checked={selectedFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFeatures([...selectedFeatures, feature]);
                                } else {
                                  setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                                }
                              }}
                            />
                            <Label htmlFor={`feature-${feature}`} className="capitalize">
                              {feature.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select which features will use this API key
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ragPreference">RAG Storage Preference</Label>
                      <Select value={ragPreference} onValueChange={setRagPreference}>
                        <SelectTrigger id="ragPreference">
                          <SelectValue placeholder="Select RAG storage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supabase">Supabase (Basic)</SelectItem>
                          <SelectItem value="pinecone">Pinecone (Advanced)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {ragPreference === 'supabase' 
                          ? 'Basic RAG uses Supabase for simple vector storage' 
                          : 'Advanced RAG uses Pinecone for high-performance vector search'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="planningMode">Planning Mode</Label>
                      <Select value={planningMode} onValueChange={setPlanningMode}>
                        <SelectTrigger id="planningMode">
                          <SelectValue placeholder="Select planning mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="advanced">Advanced (01 Reasoning)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {planningMode === 'basic' 
                          ? 'Basic planning for simple projects' 
                          : 'Advanced 01 reasoning for complex planning and decision making'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={nextStep} disabled={isAddingKey}>
                    {currentStep < 3 ? (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {isAddingKey ? "Saving..." : "Save API Key"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && configurations.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-[125px] w-full rounded-lg" />
            <Skeleton className="h-[125px] w-full rounded-lg" />
          </div>
        ) : configurations.length > 0 ? (
          <div className="space-y-4">
            {configurations.map((config) => (
              <Card key={config.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {config.api_type === 'openai' && 'OpenAI'}
                        {config.api_type === 'anthropic' && 'Anthropic'}
                        {config.api_type === 'gemini' && 'Google Gemini'}
                        {config.api_type === 'pinecone' && 'Pinecone'}
                        <Badge 
                          className={`ml-3 ${
                            config.validation_status === 'valid' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30' :
                            config.validation_status === 'invalid' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30'
                          }`}
                        >
                          {config.validation_status === 'valid' && (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Valid</>
                          )}
                          {config.validation_status === 'invalid' && (
                            <><AlertCircle className="h-3 w-3 mr-1" /> Invalid</>
                          )}
                          {config.validation_status === 'pending' && (
                            <><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Pending</>
                          )}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {config.memorable_name}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleValidateConfig(config.id)}
                        className="h-8"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Validate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteConfig(config.id)}
                        className="h-8"
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
                </CardContent>
                <CardFooter className="bg-muted/40 border-t">
                  <div className="w-full text-xs text-muted-foreground">
                    Last validated: {config.last_validated 
                      ? new Date(config.last_validated).toLocaleString() 
                      : 'Never'}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No API Keys</CardTitle>
              <CardDescription>
                You haven't configured any API keys yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add your first API key to start using AI services and other integrations.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="admin-primary-button w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First API Key
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </SettingsContainer>
  );
}
