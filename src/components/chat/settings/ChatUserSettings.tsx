
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatIconSettings } from "@/components/settings/sections/ChatIconSettings";
import { useSessionStore } from "@/stores/session/store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TokenBalanceDisplay } from "@/components/tokens/TokenBalanceDisplay";
import { ChatFeatureSettings } from "@/components/admin/settings/ChatFeatureSettings";

interface ChatUserSettingsProps {
  adminView?: boolean;
}

export function ChatUserSettings({ adminView = false }: ChatUserSettingsProps) {
  const [activeTab, setActiveTab] = useState("appearance");
  const { user } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!user && !adminView) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Chat Settings</CardTitle>
          <CardDescription>
            Please sign in to access your chat settings
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button variant="outline">Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={adminView ? "" : "shadow-md"}>
      {!adminView && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chat Settings</CardTitle>
              <CardDescription>
                Customize your chat experience
              </CardDescription>
            </div>
            <TokenBalanceDisplay compact />
          </div>
        </CardHeader>
      )}
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            <TabsTrigger value="behavior" className="flex-1">Behavior</TabsTrigger>
            {adminView && (
              <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
            )}
            <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <ChatIconSettings />
            
            {/* More appearance settings can be added here */}
          </TabsContent>
          
          <TabsContent value="behavior">
            <Card>
              <CardHeader>
                <CardTitle>Behavior Settings</CardTitle>
                <CardDescription>Configure how the chat behaves</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Behavior settings coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {adminView && (
            <TabsContent value="features">
              <ChatFeatureSettings />
            </TabsContent>
          )}
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure your chat notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notification settings coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {isLoading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </div>
  );
}
