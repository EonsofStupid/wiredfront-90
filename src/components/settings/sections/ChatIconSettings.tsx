
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare } from "lucide-react";
import { ChatIconStyle, useChatIconStyle, chatIconStyleAtom } from "@/components/chat/hooks/useChatIconStyle";
import { useAtom } from "jotai";
import { wfpulseStyle } from "@/components/chat/components/styles/WFPulseStyle";
import { defaultStyle } from "@/components/chat/components/styles/DefaultStyle";
import { retroStyle } from "@/components/chat/components/styles/RetroStyle";
import { basicStyle } from "@/components/chat/components/styles/BasicStyle";

export function ChatIconSettings() {
  const { iconStyle, setIconStyle, isLoading, error } = useChatIconStyle();
  const [localIconStyle, setLocalIconStyle] = useAtom(chatIconStyleAtom);

  useEffect(() => {
    // Set the local state if it doesn't match the store
    if (iconStyle !== localIconStyle) {
      setLocalIconStyle(iconStyle);
    }
  }, [iconStyle, localIconStyle, setLocalIconStyle]);

  const handleStyleChange = (style: ChatIconStyle) => {
    // Update the local state immediately for responsive UI
    setLocalIconStyle(style);
    // Also update the server state if needed
    setIconStyle(style);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        <p>Error loading chat icon settings. Please try again.</p>
      </div>
    );
  }

  // Helper function to render a preview of each icon style
  const renderIconPreview = (style: ChatIconStyle) => {
    const styleToUse = (() => {
      switch (style) {
        case "wfpulse": return wfpulseStyle;
        case "retro": return retroStyle;
        case "basic": return basicStyle;
        default: return defaultStyle;
      }
    })();

    return (
      <div className="bg-muted p-4 rounded-md flex justify-center h-24">
        <div className="relative">
          <div className={`${styleToUse.button} flex items-center justify-center`}>
            <MessageSquare className={styleToUse.icon} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Icon Style</CardTitle>
        <CardDescription>Customize the appearance of your chat button</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            value={localIconStyle}
            onValueChange={(value) => handleStyleChange(value as ChatIconStyle)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              {renderIconPreview("default")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wfpulse" id="wfpulse" />
                <Label htmlFor="wfpulse">WF Pulse</Label>
              </div>
              {renderIconPreview("wfpulse")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retro" id="retro" />
                <Label htmlFor="retro">Retro</Label>
              </div>
              {renderIconPreview("retro")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic">Basic</Label>
              </div>
              {renderIconPreview("basic")}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
