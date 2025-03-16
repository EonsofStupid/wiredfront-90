
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/components/chat/store/chatStore";
import { ArrowLeftRight, Pin, PinOff, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { FeatureKey } from "@/components/chat/store/actions/feature-actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ChatFeatureSettings = () => {
  const { position, togglePosition, docked, toggleDocked, scale, setScale } = useChatStore();
  const { features, toggleFeature, isUpdating } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState("features");
  
  // State for chat styling
  const [chatBg, setChatBg] = useState("rgba(0, 0, 0, 0.3)");
  const [userMessageColor, setUserMessageColor] = useState("#8B5CF6");
  const [assistantMessageColor, setAssistantMessageColor] = useState("#374151");
  const [chatWidth, setChatWidth] = useState("400");
  const [chatHeight, setChatHeight] = useState("500");
  
  const handleReset = () => {
    // Reset all features to default
    if (!features.codeAssistant) toggleFeature('codeAssistant' as FeatureKey);
    if (!features.ragSupport) toggleFeature('ragSupport' as FeatureKey);
    if (!features.githubSync) toggleFeature('githubSync' as FeatureKey);
    if (!features.notifications) toggleFeature('notifications' as FeatureKey);
    
    // Reset styling to defaults
    setChatBg("rgba(0, 0, 0, 0.3)");
    setUserMessageColor("#8B5CF6");
    setAssistantMessageColor("#374151");
    setChatWidth("400");
    setChatHeight("500");
    setScale(1);
    
    // Apply default styles
    applyChatStyles();
    
    toast.success("Chat features and styling reset to defaults");
  };
  
  const applyChatStyles = () => {
    document.documentElement.style.setProperty('--chat-bg', chatBg);
    document.documentElement.style.setProperty('--chat-message-user-bg', userMessageColor);
    document.documentElement.style.setProperty('--chat-message-assistant-bg', assistantMessageColor);
    document.documentElement.style.setProperty('--chat-width', `${chatWidth}px`);
    document.documentElement.style.setProperty('--chat-height', `${chatHeight}px`);
    
    toast.success("Chat styling updated successfully");
  };

  return (
    <TooltipProvider>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Chat Feature Settings</h2>
            <p className="text-muted-foreground mb-4">
              Configure which features are available in the chat interface.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-sm font-medium">Position & Behavior</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="position">Position</Label>
                  <p className="text-sm text-muted-foreground">
                    Current position: {typeof position === 'string' 
                      ? (position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left') 
                      : `Custom (${position.x}, ${position.y})`}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={togglePosition}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Toggle Position
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="docked">Docked Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {docked ? 'Chat is fixed in position' : 'Chat is freely draggable'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={toggleDocked}
                  className="flex items-center gap-2"
                >
                  {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  {docked ? 'Undock' : 'Dock'}
                </Button>
              </div>
              
              <h3 className="text-sm font-medium mt-6">Features</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="codeAssistant">Code Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable code assistance features
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      id="codeAssistant" 
                      checked={features.codeAssistant} 
                      onCheckedChange={() => toggleFeature('codeAssistant' as FeatureKey)}
                      disabled={isUpdating}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {features.codeAssistant ? 'Disable' : 'Enable'} code assistance
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ragSupport">RAG Support</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable retrieval augmented generation
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      id="ragSupport" 
                      checked={features.ragSupport} 
                      onCheckedChange={() => toggleFeature('ragSupport' as FeatureKey)}
                      disabled={isUpdating}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {features.ragSupport ? 'Disable' : 'Enable'} RAG support
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="githubSync">GitHub Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable GitHub integration in editor mode
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      id="githubSync" 
                      checked={features.githubSync} 
                      onCheckedChange={() => toggleFeature('githubSync' as FeatureKey)}
                      disabled={isUpdating}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {features.githubSync ? 'Disable' : 'Enable'} GitHub sync
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable notification features
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      id="notifications" 
                      checked={features.notifications} 
                      onCheckedChange={() => toggleFeature('notifications' as FeatureKey)}
                      disabled={isUpdating}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {features.notifications ? 'Disable' : 'Enable'} notifications
                  </TooltipContent>
                </Tooltip>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <h3 className="text-sm font-medium">Styling & Colors</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chatBg">Chat Background</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: chatBg }}></div>
                    <Input 
                      id="chatBg" 
                      value={chatBg} 
                      onChange={(e) => setChatBg(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userMessageColor">User Message Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: userMessageColor }}></div>
                    <Input 
                      id="userMessageColor" 
                      value={userMessageColor} 
                      onChange={(e) => setUserMessageColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assistantMessageColor">Assistant Message Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: assistantMessageColor }}></div>
                    <Input 
                      id="assistantMessageColor" 
                      value={assistantMessageColor} 
                      onChange={(e) => setAssistantMessageColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scale">Chat Scale ({scale.toFixed(1)}x)</Label>
                  <input
                    id="scale"
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="chatWidth">Chat Width (px)</Label>
                  <Input 
                    id="chatWidth" 
                    type="number" 
                    value={chatWidth} 
                    onChange={(e) => setChatWidth(e.target.value)}
                    min="320"
                    max="800"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chatHeight">Chat Height (px)</Label>
                  <Input 
                    id="chatHeight" 
                    type="number" 
                    value={chatHeight} 
                    onChange={(e) => setChatHeight(e.target.value)}
                    min="300"
                    max="800"
                  />
                </div>
              </div>
              
              <Button 
                onClick={applyChatStyles} 
                className="w-full mt-4"
                variant="default"
              >
                <Palette className="h-4 w-4 mr-2" />
                Apply Styling
              </Button>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="w-full"
            disabled={isUpdating}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}

export default ChatFeatureSettings;
