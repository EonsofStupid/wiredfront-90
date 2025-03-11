
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { GitHubTokenManagement } from "./github/GitHubTokenManagement";

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
  onDockerTokenChange,
}: DevelopmentSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Development Tokens</h3>
        <p className="text-sm text-muted-foreground">
          Manage API tokens for development services like GitHub and Docker
        </p>
      </div>

      <GitHubTokenManagement />

      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Docker Hub Token</AdminCardTitle>
          <AdminCardDescription>
            Configure your Docker Hub API token for container operations
          </AdminCardDescription>
        </AdminCardHeader>
        <AdminCardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docker-token">Docker Hub Token</Label>
              <Input
                id="docker-token"
                type="password"
                placeholder="Enter your Docker Hub API token"
                value={dockerToken}
                onChange={(e) => onDockerTokenChange(e.target.value)}
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
              />
              <p className="text-xs text-muted-foreground">
                Get your Docker Hub token from the{" "}
                <a 
                  href="https://hub.docker.com/settings/security" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#8B5CF6] hover:text-[#D946EF] transition-colors"
                >
                  Security settings
                </a>
              </p>
            </div>
          </div>
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
