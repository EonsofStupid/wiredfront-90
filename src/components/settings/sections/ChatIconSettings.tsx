
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ChatIconStyle, useChatIconStyle } from "@/components/chat/hooks/useChatIconStyle";
import { ChatToggleButton } from "@/components/chat/components/ChatToggleButton";

export function ChatIconSettings() {
  const { iconStyle, setIconStyle, isLoading, error } = useChatIconStyle();

  const handleStyleChange = (style: ChatIconStyle) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Icon Style</CardTitle>
        <CardDescription>Customize the appearance of your chat button</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            value={iconStyle}
            onValueChange={(value) => handleStyleChange(value as ChatIconStyle)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              <div className="bg-muted p-4 rounded-md flex justify-center">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChatToggleButton onClick={() => {}} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wfpulse" id="wfpulse" />
                <Label htmlFor="wfpulse">WF Pulse</Label>
              </div>
              <div className="bg-muted p-4 rounded-md flex justify-center">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChatToggleButton onClick={() => {}} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retro" id="retro" />
                <Label htmlFor="retro">Retro</Label>
              </div>
              <div className="bg-muted p-4 rounded-md flex justify-center">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChatToggleButton onClick={() => {}} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic">Basic</Label>
              </div>
              <div className="bg-muted p-4 rounded-md flex justify-center">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChatToggleButton onClick={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
