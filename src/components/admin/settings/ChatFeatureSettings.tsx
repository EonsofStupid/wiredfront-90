import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/components/chat/store/chatStore";
import { ArrowLeftRight, Pin, PinOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { FeatureKey } from "@/components/chat/types/feature-types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatPosition } from "@/types/chat/enums";
import { ChatPositionCoordinates } from "@/components/chat/types/chat-modes";

export const ChatFeatureSettings = () => {
  const { position, togglePosition, docked, toggleDocked } = useChatStore();
  const { features, toggleFeature, isUpdating } = useFeatureFlags();

  const handleReset = () => {
    // Reset all features to default
    if (!features.codeAssistant) toggleFeature('codeAssistant' as FeatureKey);
    if (!features.ragSupport) toggleFeature('ragSupport' as FeatureKey);
    if (!features.githubSync) toggleFeature('githubSync' as FeatureKey);
    if (!features.notifications) toggleFeature('notifications' as FeatureKey);
    
    toast.success("Chat features reset to defaults");
  };

  // Safely determine the position display text
  const getPositionDisplayText = () => {
    if (typeof position === 'string') {
      return position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left';
    } else if (position && typeof position === 'object') {
      return `Custom (${position.x}, ${position.y})`;
    }
    return 'Unknown';
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

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Position & Behavior</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="position">Position</Label>
                <p className="text-sm text-muted-foreground">
                  Current position: {getPositionDisplayText()}
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
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Features</h3>
            
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
          </div>
          
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
