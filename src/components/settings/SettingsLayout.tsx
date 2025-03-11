
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, User, Github, Lock } from "lucide-react";
import { ProfileSettings } from "./sections/ProfileSettings";
import { GitHubSettings } from "./sections/GitHubSettings";
import { GeneralSettings } from "./sections/GeneralSettings";
import { ApiSettings } from "./sections/ApiSettings";

export function SettingsLayout() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="github">
            <GitHubSettings />
          </TabsContent>
          
          <TabsContent value="api">
            <ApiSettings />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
