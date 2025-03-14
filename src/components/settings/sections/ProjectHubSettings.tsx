
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Folder, 
  Github, 
  RefreshCw, 
  Save, 
  Database,
  Code,
  Zap
} from "lucide-react";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { useProjects } from "@/hooks/projects/useProjects";

export function ProjectHubSettings() {
  const { isConnected, githubUsername } = useGitHubConnection();
  const { projects, activeProject } = useProjects();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Hub Settings</CardTitle>
          <CardDescription>
            Configure your Project Hub experience and default project settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="interface">
            <TabsList>
              <TabsTrigger value="interface">Interface</TabsTrigger>
              <TabsTrigger value="defaults">Defaults</TabsTrigger>
              <TabsTrigger value="integration">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interface" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-expand" className="flex flex-col space-y-1">
                    <span>Auto-expand Project Hub</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically expand Project Hub when viewing a project
                    </span>
                  </Label>
                  <Switch id="auto-expand" />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dark-theme" className="flex flex-col space-y-1">
                    <span>Use custom theme</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Apply a custom theme to the Project Hub
                    </span>
                  </Label>
                  <Switch id="dark-theme" />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-save" className="flex flex-col space-y-1">
                    <span>Auto-save projects</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically save project changes
                    </span>
                  </Label>
                  <Switch id="auto-save" defaultChecked />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="defaults" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-project">Default Project</Label>
                  <Select defaultValue={activeProject?.id}>
                    <SelectTrigger id="default-project">
                      <SelectValue placeholder="Select default project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="default-sync">Default Sync Frequency</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger id="default-sync">
                      <SelectValue placeholder="Select sync frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Realtime</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="default-notification">Default Notifications</Label>
                  <Select defaultValue="important">
                    <SelectTrigger id="default-notification">
                      <SelectValue placeholder="Select notification level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="space-y-4 pt-4">
              <Card className="border-muted bg-muted/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub Integration
                    </CardTitle>
                    <Badge>{isConnected ? "Connected" : "Disconnected"}</Badge>
                  </div>
                  <CardDescription>
                    {isConnected 
                      ? `Connected as @${githubUsername}` 
                      : "Connect your GitHub account to enable repository features"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="auto-sync" className="flex flex-col space-y-1">
                        <span>Auto-sync repositories</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Automatically sync changes with GitHub
                        </span>
                      </Label>
                      <Switch id="auto-sync" disabled={!isConnected} />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="commit-preview" className="flex flex-col space-y-1">
                        <span>Show commit previews</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Preview changes before committing
                        </span>
                      </Label>
                      <Switch id="commit-preview" disabled={!isConnected} defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-muted bg-muted/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4" /> Database Integration
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="auto-index" className="flex flex-col space-y-1">
                        <span>Auto-index projects</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Automatically index project files for search
                        </span>
                      </Label>
                      <Switch id="auto-index" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Define Badge component here since it wasn't imported
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
    {children}
  </span>
);
