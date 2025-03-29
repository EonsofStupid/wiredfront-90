
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Pin, PinOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatPosition } from "@/types/enums";
import { useChatFeatures, useChatFeature } from "@/stores/features/chat/chatFeatures";
import { useChatBridge } from "@/modules/ChatBridge/useChatBridge";

export const ChatFeatureSettings = () => {
  const chatBridge = useChatBridge();
  const { resetFeatures } = useChatFeatures();
  
  // Get current position and docked state from ChatBridge
  const state = chatBridge.getState();
  const position = state.position === 'bottom-right' ? ChatPosition.BottomRight : ChatPosition.BottomLeft;
  const docked = state.docked;

  const handleReset = () => {
    resetFeatures();
    toast.success("Chat features reset to defaults");
  };

  // Safely determine the position display text
  const getPositionDisplayText = () => {
    if (position === ChatPosition.BottomRight) {
      return 'Bottom Right';
    } else if (position === ChatPosition.BottomLeft) {
      return 'Bottom Left';
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
                onClick={() => chatBridge.togglePosition()}
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
                onClick={() => chatBridge.toggleDocked()}
                className="flex items-center gap-2"
              >
                {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                {docked ? 'Undock' : 'Dock'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Features</h3>
            
            <ChatFeatureToggle 
              id="codeAssistant"
              label="Code Assistant"
              description="Enable code assistance features"
              featureKey="codeAssistant"
            />
            
            <ChatFeatureToggle 
              id="ragSupport"
              label="RAG Support"
              description="Enable retrieval augmented generation"
              featureKey="ragSupport"
            />
            
            <ChatFeatureToggle 
              id="imageGeneration"
              label="Image Generation"
              description="Enable AI image generation"
              featureKey="imageGeneration"
            />
            
            <ChatFeatureToggle 
              id="notifications"
              label="Notifications"
              description="Enable notification features"
              featureKey="notifications"
            />
          </div>
          
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}

// Reusable component for chat feature toggles
const ChatFeatureToggle = ({ id, label, description, featureKey }: { 
  id: string; 
  label: string; 
  description: string; 
  featureKey: string; 
}) => {
  const { enabled, toggle } = useChatFeature(featureKey as any);

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch 
            id={id} 
            checked={enabled} 
            onCheckedChange={toggle}
          />
        </TooltipTrigger>
        <TooltipContent>
          {enabled ? 'Disable' : 'Enable'} {label.toLowerCase()}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ChatFeatureSettings;
