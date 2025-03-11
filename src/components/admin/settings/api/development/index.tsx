
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Github, Server } from "lucide-react";
import { SettingsContainer } from "../../layout/SettingsContainer";
import { GitHubSettings } from "./GitHubSettings";
import { DockerSettings } from "./DockerSettings";
import { DatabaseSettings } from "./DatabaseSettings";

interface DevelopmentSettingsProps {
  githubToken: string;
  dockerToken: string;
  onGithubTokenChange: (value: string) => void;
  onDockerTokenChange: (value: string) => void;
}

export function DevelopmentSettings({
  githubToken,
  dockerToken,
  onGithubTokenChange,
  onDockerTokenChange
}: DevelopmentSettingsProps) {
  return (
    <SettingsContainer
      title="Development Integrations"
      description="Manage development tokens for GitHub, Docker, and other services"
    >
      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="docker" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Docker
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="github" className="space-y-4 pt-4">
          <GitHubSettings 
            githubToken={githubToken}
            onGithubTokenChange={onGithubTokenChange}
          />
        </TabsContent>
        
        <TabsContent value="docker" className="space-y-4 pt-4">
          <DockerSettings 
            dockerToken={dockerToken}
            onDockerTokenChange={onDockerTokenChange}
          />
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 pt-4">
          <DatabaseSettings />
        </TabsContent>
      </Tabs>
    </SettingsContainer>
  );
}
