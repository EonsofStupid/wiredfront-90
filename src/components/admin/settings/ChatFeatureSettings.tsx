import { convertFeatureKeyToChatFeature } from "@/components/chat/store/actions/feature/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useChatLayoutStore } from "@/stores/chat/chatLayoutStore";
import { KnownFeatureFlag } from "@/types/admin/settings/feature-flags";
import { DEFAULT_LAYOUT } from "@/types/chat/layout";
import { ArrowLeftRight, Palette, Pin, PinOff, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ChatFeatureSettings = () => {
  const { position, setPosition, docked, toggleDocked, scale, setScale } = useChatLayoutStore();
  const { features, toggleFeature, isUpdating } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState("features");
  // State for chat styling
  const [chatBg, setChatBg] = useState("rgba(0, 0, 0, 0.3)");
  const [userMessageColor, setUserMessageColor] = useState("#8B5CF6");
  const [assistantMessageColor, setAssistantMessageColor] = useState("#374151");
  const [chatWidth, setChatWidth] = useState("400");
  const [chatHeight, setChatHeight] = useState("500");

  const handleReset = () => {
    // Reset all features to default using proper feature key mapping
    const codeAssistantKey = KnownFeatureFlag.CODE_ASSISTANT;
    const ragSupportKey = KnownFeatureFlag.RAG_SUPPORT;
    const githubSyncKey = KnownFeatureFlag.GITHUB_SYNC;
    const notificationsKey = KnownFeatureFlag.NOTIFICATIONS;
    if (codeAssistantKey && !features.codeAssistant) toggleFeature(codeAssistantKey);
    if (ragSupportKey && !features.ragSupport) toggleFeature(ragSupportKey);
    if (githubSyncKey && !features.githubSync) toggleFeature(githubSyncKey);
    if (notificationsKey && !features.notifications) toggleFeature(notificationsKey);
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

  // Helper to toggle feature with proper type mapping
  const handleToggleFeature = (flag: KnownFeatureFlag) => {
    const chatFeatureKey = convertFeatureKeyToChatFeature(flag);
    if (chatFeatureKey) {
      toggleFeature(chatFeatureKey);
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="codeAssistant">Code Assistant</Label>
                <p className="text-sm text-muted-foreground">
                  Enable AI-powered code completion and suggestions
                </p>
              </div>
              <Switch
                id="codeAssistant"
                checked={features.codeAssistant}
                onCheckedChange={() => handleToggleFeature(KnownFeatureFlag.CODE_ASSISTANT)}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ragSupport">RAG Support</Label>
                <p className="text-sm text-muted-foreground">
                  Enable retrieval-augmented generation for better context
                </p>
              </div>
              <Switch
                id="ragSupport"
                checked={features.ragSupport}
                onCheckedChange={() => handleToggleFeature(KnownFeatureFlag.RAG_SUPPORT)}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="githubSync">GitHub Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic synchronization with GitHub repositories
                </p>
              </div>
              <Switch
                id="githubSync"
                checked={features.githubSync}
                onCheckedChange={() => handleToggleFeature(KnownFeatureFlag.GITHUB_SYNC)}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable desktop notifications for chat events
                </p>
              </div>
              <Switch
                id="notifications"
                checked={features.notifications}
                onCheckedChange={() => handleToggleFeature(KnownFeatureFlag.NOTIFICATIONS)}
                disabled={isUpdating}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="styling">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="position">Position</Label>
                <p className="text-sm text-muted-foreground">
                  {docked ? 'Chat is fixed in position' : 'Chat is freely draggable'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setPosition(DEFAULT_LAYOUT.position)}
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Reset Position
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
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
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="scale">Scale</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the size of the chat window
                </p>
              </div>
              <Input
                id="scale"
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="chatBg">Background Color</Label>
                <p className="text-sm text-muted-foreground">
                  Set the chat window background color
                </p>
              </div>
              <Input
                id="chatBg"
                type="color"
                value={chatBg}
                onChange={(e) => setChatBg(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="userMessageColor">User Message Color</Label>
                <p className="text-sm text-muted-foreground">
                  Set the color for user messages
                </p>
              </div>
              <Input
                id="userMessageColor"
                type="color"
                value={userMessageColor}
                onChange={(e) => setUserMessageColor(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="assistantMessageColor">Assistant Message Color</Label>
                <p className="text-sm text-muted-foreground">
                  Set the color for assistant messages
                </p>
              </div>
              <Input
                id="assistantMessageColor"
                type="color"
                value={assistantMessageColor}
                onChange={(e) => setAssistantMessageColor(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="chatWidth">Width</Label>
                <p className="text-sm text-muted-foreground">
                  Set the chat window width
                </p>
              </div>
              <Input
                id="chatWidth"
                type="number"
                min="300"
                max="800"
                value={chatWidth}
                onChange={(e) => setChatWidth(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="chatHeight">Height</Label>
                <p className="text-sm text-muted-foreground">
                  Set the chat window height
                </p>
              </div>
              <Input
                id="chatHeight"
                type="number"
                min="400"
                max="800"
                value={chatHeight}
                onChange={(e) => setChatHeight(e.target.value)}
                className="w-24"
              />
            </div>
            <Button
              variant="outline"
              onClick={applyChatStyles}
              className="w-full"
            >
              <Palette className="h-4 w-4 mr-2" />
              Apply Styles
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChatFeatureSettings;
