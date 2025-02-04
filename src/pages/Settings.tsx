import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/user/settings/UserProfile";
import { UserPreferences } from "@/components/user/settings/UserPreferences";
import { Settings as SettingsIcon, User } from "lucide-react";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <UserProfile />
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <UserPreferences />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;