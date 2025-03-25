
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/components/chat/store/chatStore";
import { 
  Bot, 
  Settings, 
  MessageCircle, 
  BotMessageSquare, 
  Braces, 
  MessagesSquare, 
  BrainCircuit,
  Save
} from "lucide-react";
import { SettingsContainer } from "../../layout/SettingsContainer";
import { toast } from "sonner";
import { ChatPosition } from "@/components/chat/store/types/chat-store-types";

// Define provider types for chat
export type ChatProviderType = 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama';

interface ChatProvider {
  id: string;
  name: string;
  type: ChatProviderType;
  isEnabled: boolean;
  isDefault: boolean;
  apiReference: string;
}

export function ChatProviderSettings() {
  const { features, toggleFeature, position, togglePosition, docked, toggleDocked } = useChatStore();
  
  // Example providers - in a real app these would come from a database
  const [providers, setProviders] = useState<ChatProvider[]>([
    { 
      id: '1', 
      name: 'OpenAI', 
      type: 'openai', 
      isEnabled: true, 
      isDefault: true,
      apiReference: 'openai'
    },
    { 
      id: '2', 
      name: 'Claude', 
      type: 'anthropic', 
      isEnabled: false, 
      isDefault: false,
      apiReference: 'anthropic'
    },
    { 
      id: '3', 
      name: 'Gemini', 
      type: 'gemini', 
      isEnabled: false, 
      isDefault: false,
      apiReference: 'gemini'
    }
  ]);
  
  const [newProvider, setNewProvider] = useState({
    name: '',
    type: 'openai' as ChatProviderType,
    apiReference: ''
  });
  
  // Function to toggle provider enabled status
  const toggleProviderEnabled = (id: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === id 
          ? { ...provider, isEnabled: !provider.isEnabled } 
          : provider
      )
    );
  };
  
  // Function to set a provider as default
  const setDefaultProvider = (id: string) => {
    setProviders(prev => 
      prev.map(provider => ({
        ...provider,
        isDefault: provider.id === id
      }))
    );
  };
  
  // Function to save all provider settings
  const saveProviderSettings = () => {
    toast.success("Chat provider settings saved successfully");
  };
  
  // Function to add a new provider
  const addNewProvider = () => {
    if (!newProvider.name || !newProvider.apiReference) {
      toast.error("Provider name and API reference are required");
      return;
    }
    
    setProviders(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newProvider.name,
        type: newProvider.type,
        isEnabled: false,
        isDefault: false,
        apiReference: newProvider.apiReference
      }
    ]);
    
    setNewProvider({
      name: '',
      type: 'openai' as ChatProviderType,
      apiReference: ''
    });
    
    toast.success("New provider added");
  };
  
  // Determine position display text
  const getPositionDisplayText = () => {
    if (typeof position === 'string') {
      return position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left';
    }
    
    // Type guard to ensure position is an object with x and y properties
    if (position && typeof position === 'object' && 'x' in position && 'y' in position) {
      return `Custom (${position.x}, ${position.y})`;
    }
    
    return 'Unknown';
  };
  
  return (
    <SettingsContainer
      title="Chat Provider Settings"
      description="Configure chat providers, features and appearance"
    >
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <BotMessageSquare className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Braces className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>
        
        {/* Providers Tab */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Chat Providers</CardTitle>
              <CardDescription>
                Configure which AI providers are available in the chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map(provider => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">API: {provider.apiReference}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`enabled-${provider.id}`}>Enabled</Label>
                        <Switch 
                          id={`enabled-${provider.id}`} 
                          checked={provider.isEnabled}
                          onCheckedChange={() => toggleProviderEnabled(provider.id)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`default-${provider.id}`}>Default</Label>
                        <Switch 
                          id={`default-${provider.id}`} 
                          checked={provider.isDefault}
                          onCheckedChange={() => setDefaultProvider(provider.id)}
                          disabled={!provider.isEnabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add new provider form */}
                <div className="pt-6 border-t">
                  <h3 className="text-sm font-medium mb-4">Add New Provider</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider-name">Provider Name</Label>
                      <Input 
                        id="provider-name"
                        value={newProvider.name}
                        onChange={e => setNewProvider({...newProvider, name: e.target.value})}
                        placeholder="e.g. My Custom OpenAI"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-type">Provider Type</Label>
                      <select 
                        id="provider-type"
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                        value={newProvider.type}
                        onChange={e => setNewProvider({
                          ...newProvider, 
                          type: e.target.value as ChatProviderType
                        })}
                      >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="gemini">Gemini</option>
                        <option value="perplexity">Perplexity</option>
                        <option value="llama">Llama</option>
                        <option value="local">Local</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-reference">API Reference</Label>
                      <Input 
                        id="api-reference"
                        value={newProvider.apiReference}
                        onChange={e => setNewProvider({...newProvider, apiReference: e.target.value})}
                        placeholder="e.g. openai_gpt4o"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addNewProvider} 
                    className="mt-4"
                  >
                    Add Provider
                  </Button>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={saveProviderSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Provider Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Features Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Chat Features</CardTitle>
              <CardDescription>
                Configure which features are available in the chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="codeAssistant">Code Assistant</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable code assistance in chat
                    </p>
                  </div>
                  <Switch 
                    id="codeAssistant" 
                    checked={features.codeAssistant} 
                    onCheckedChange={() => toggleFeature('codeAssistant')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ragSupport">RAG Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable retrieval augmented generation
                    </p>
                  </div>
                  <Switch 
                    id="ragSupport" 
                    checked={features.ragSupport} 
                    onCheckedChange={() => toggleFeature('ragSupport')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="githubSync">GitHub Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable GitHub integration in chat
                    </p>
                  </div>
                  <Switch 
                    id="githubSync" 
                    checked={features.githubSync} 
                    onCheckedChange={() => toggleFeature('githubSync')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable notification features
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={features.notifications} 
                    onCheckedChange={() => toggleFeature('notifications')}
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={() => toast.success("Feature settings saved")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Feature Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Chat Appearance</CardTitle>
              <CardDescription>
                Configure how the chat appears to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="position">Default Position</Label>
                    <p className="text-sm text-muted-foreground">
                      Current position: {getPositionDisplayText()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={togglePosition}
                  >
                    Toggle Position
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="docked">Default Docking</Label>
                    <p className="text-sm text-muted-foreground">
                      {docked ? 'Fixed in position' : 'Freely draggable'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={toggleDocked}
                  >
                    {docked ? 'Make Draggable' : 'Make Fixed'}
                  </Button>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={() => toast.success("Appearance settings saved")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Appearance Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Configure chat session behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Session Cleanup</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically clean up inactive sessions
                    </p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={() => toast.success("All inactive sessions terminated")}
                  >
                    Terminate Inactive Sessions
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground">
                      Set how long sessions remain active without interaction
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      defaultValue="30"
                      className="w-20"
                    />
                    <span>minutes</span>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={() => toast.success("Session settings saved")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Session Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsContainer>
  );
}
