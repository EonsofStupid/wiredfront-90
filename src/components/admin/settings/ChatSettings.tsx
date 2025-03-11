
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, MessageSquare, Settings, Brain, UserCog, Share2, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { useMessageStore } from "@/components/chat/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SettingsContainer } from "./layout/SettingsContainer";
import { toast } from "sonner";

export const ChatSettings = () => {
  const { clearMessages } = useMessageStore();
  const { currentSessionId, refreshSessions } = useSessionManager();
  const [activeTab, setActiveTab] = useState("general");

  // Sample state - in production, these would be connected to real data
  const [featuresEnabled, setFeaturesEnabled] = useState({
    codeAssistant: true,
    ragSupport: true,
    planningMode: false,
    messageHistory: true,
    voiceInput: true,
    voiceOutput: false,
    githubSync: true,
  });

  const [limitSettings, setLimitSettings] = useState({
    maxMessagesPerDay: 100,
    maxTokensPerMessage: 4000,
    maxHistoryLength: 50,
  });

  const [modelSettings, setModelSettings] = useState({
    defaultModel: "gpt-4o",
    temperature: 0.7,
    maxContextWindow: 16000,
  });

  const toggleFeature = (feature: keyof typeof featuresEnabled) => {
    setFeaturesEnabled(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleTerminateSessions = async () => {
    try {
      // Clear all messages from the current session
      clearMessages();
      
      // Force refresh sessions to clean up any hanging states
      await refreshSessions();
      
      toast.success("Successfully terminated all active sessions");
    } catch (error) {
      console.error('Error terminating sessions:', error);
      toast.error("Failed to terminate sessions");
    }
  };

  return (
    <SettingsContainer
      title="Chat System Settings"
      description="Configure settings for the AI chat system"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="general" className="admin-tab">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="features" className="admin-tab">
            <Zap className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="models" className="admin-tab">
            <Brain className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="sessions" className="admin-tab">
            <MessageSquare className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="admin-tab">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Chat Settings</CardTitle>
              <CardDescription>Configure system-wide chat settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default Chat Visibility</Label>
                    <p className="text-sm text-muted-foreground">Control whether chat is visible by default</p>
                  </div>
                  <Select defaultValue="visible">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visible">Visible</SelectItem>
                      <SelectItem value="collapsed">Collapsed</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit messages per user per day</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      className="w-20" 
                      value={limitSettings.maxMessagesPerDay}
                      onChange={(e) => setLimitSettings({
                        ...limitSettings,
                        maxMessagesPerDay: parseInt(e.target.value)
                      })}
                    />
                    <span className="text-sm text-muted-foreground">msgs/day</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Position on Screen</Label>
                    <p className="text-sm text-muted-foreground">Default chat window position</p>
                  </div>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Interface Settings</CardTitle>
              <CardDescription>Control the appearance and behavior of the chat UI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Theme</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme for chat interface</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable UI animations</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Draggable Window</Label>
                  <p className="text-sm text-muted-foreground">Allow users to move chat window</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Timestamps</Label>
                  <p className="text-sm text-muted-foreground">Display time for each message</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable specific chat features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-code-assistant">Code Assistant</Label>
                  <p className="text-sm text-muted-foreground">AI-assisted code generation and editing</p>
                </div>
                <Switch 
                  id="toggle-code-assistant" 
                  checked={featuresEnabled.codeAssistant}
                  onCheckedChange={() => toggleFeature('codeAssistant')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-rag">RAG Support</Label>
                  <p className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Retrieval Augmented Generation
                      <Badge variant="outline" className="text-xs h-5">Premium</Badge>
                    </span>
                  </p>
                </div>
                <Switch 
                  id="toggle-rag" 
                  checked={featuresEnabled.ragSupport}
                  onCheckedChange={() => toggleFeature('ragSupport')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-planning-mode">Planning Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Step-by-step reasoning for complex tasks
                      <Badge variant="outline" className="text-xs h-5">Beta</Badge>
                    </span>
                  </p>
                </div>
                <Switch 
                  id="toggle-planning-mode" 
                  checked={featuresEnabled.planningMode}
                  onCheckedChange={() => toggleFeature('planningMode')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-history">Message History</Label>
                  <p className="text-sm text-muted-foreground">Store and display conversation history</p>
                </div>
                <Switch 
                  id="toggle-history" 
                  checked={featuresEnabled.messageHistory}
                  onCheckedChange={() => toggleFeature('messageHistory')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-voice-input">Voice Input</Label>
                  <p className="text-sm text-muted-foreground">Allow voice input for messages</p>
                </div>
                <Switch 
                  id="toggle-voice-input" 
                  checked={featuresEnabled.voiceInput}
                  onCheckedChange={() => toggleFeature('voiceInput')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-voice-output">Voice Output</Label>
                  <p className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      Text-to-speech for AI responses
                      <Badge variant="outline" className="text-xs h-5">Beta</Badge>
                    </span>
                  </p>
                </div>
                <Switch 
                  id="toggle-voice-output" 
                  checked={featuresEnabled.voiceOutput}
                  onCheckedChange={() => toggleFeature('voiceOutput')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="toggle-github-sync">GitHub Sync</Label>
                  <p className="text-sm text-muted-foreground">Integrate with GitHub repositories</p>
                </div>
                <Switch 
                  id="toggle-github-sync" 
                  checked={featuresEnabled.githubSync}
                  onCheckedChange={() => toggleFeature('githubSync')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>Configure detailed settings for enabled features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default RAG Vector Store</Label>
                <Select defaultValue="pinecone">
                  <SelectTrigger>
                    <SelectValue placeholder="Select vector store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase Vector Store</SelectItem>
                    <SelectItem value="pinecone">Pinecone</SelectItem>
                    <SelectItem value="qdrant">Qdrant</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used for storing and retrieving embeddings in RAG features
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Planning Mode Verbosity</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue placeholder="Select verbosity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="auto">Auto (content-aware)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls how detailed the planning steps are
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>Configure the AI models and their parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Chat Model</Label>
                <Select 
                  value={modelSettings.defaultModel}
                  onValueChange={(value) => setModelSettings({
                    ...modelSettings,
                    defaultModel: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The default model used for chat interactions
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm">{modelSettings.temperature.toFixed(1)}</span>
                </div>
                <Slider
                  value={[modelSettings.temperature]}
                  min={0}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setModelSettings({
                    ...modelSettings,
                    temperature: value[0]
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls randomness: lower values are more deterministic, higher values more creative
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Tokens Per Message</Label>
                  <Input 
                    type="number" 
                    className="w-20" 
                    value={limitSettings.maxTokensPerMessage}
                    onChange={(e) => setLimitSettings({
                      ...limitSettings,
                      maxTokensPerMessage: parseInt(e.target.value)
                    })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum tokens allowed in a single response
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Context Window</Label>
                  <Select 
                    value={modelSettings.maxContextWindow.toString()}
                    onValueChange={(value) => setModelSettings({
                      ...modelSettings,
                      maxContextWindow: parseInt(value)
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select window size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8000">8K tokens</SelectItem>
                      <SelectItem value="16000">16K tokens</SelectItem>
                      <SelectItem value="32000">32K tokens</SelectItem>
                      <SelectItem value="128000">128K tokens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum tokens in the conversation history
                </p>
              </div>

              <div className="space-y-2">
                <Label>Model Fallback Order</Label>
                <div className="border rounded-md p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm font-medium">1. GPT-4o</span>
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">2. Claude 3 Opus</span>
                      <span className="text-xs text-muted-foreground">Fallback</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <span className="text-sm font-medium">3. GPT-4o Mini</span>
                      <span className="text-xs text-muted-foreground">Emergency</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Order in which models are used if primary is unavailable
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage active and inactive chat sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">How long until inactive sessions are closed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      className="w-20" 
                      defaultValue="30"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Max History Length</Label>
                    <p className="text-sm text-muted-foreground">Maximum number of messages to keep in history</p>
                  </div>
                  <Input 
                    type="number" 
                    className="w-20" 
                    value={limitSettings.maxHistoryLength}
                    onChange={(e) => setLimitSettings({
                      ...limitSettings,
                      maxHistoryLength: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Clean Sessions</Label>
                    <p className="text-sm text-muted-foreground">Automatically clean up old sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Emergency Controls
                  </h4>
                </div>

                <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-destructive-foreground">
                      These actions will forcefully terminate all chat sessions.
                      Use only when necessary to reset the system.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleTerminateSessions}
                      className="w-full sm:w-auto"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Terminate All Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Track and monitor chat system usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Usage</Label>
                    <p className="text-sm text-muted-foreground">Monitor API usage and costs</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Monthly Budget Alert</Label>
                    <p className="text-sm text-muted-foreground">Send alert when budget threshold is reached</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input 
                      type="number" 
                      className="w-20" 
                      defaultValue="50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Usage Reports</Label>
                    <p className="text-sm text-muted-foreground">Send periodic usage reports</p>
                  </div>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Current Month Usage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Requests:</span>
                    <span className="text-sm font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Tokens:</span>
                    <span className="text-sm font-medium">543,210</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estimated Cost:</span>
                    <span className="text-sm font-medium">$12.34</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={() => {
            toast.success("Chat settings saved successfully");
          }}
          className="admin-primary-button group"
        >
          <Save className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Save Chat Settings
        </Button>
      </div>
    </SettingsContainer>
  );
};
