import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Card>
        <CardHeader>
          <CardTitle>GitHub API</CardTitle>
          <CardDescription>
            Configure GitHub integration for repository management and code syncing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-token">Personal Access Token</Label>
            <Input
              id="github-token"
              type="password"
              value={githubToken}
              onChange={(e) => onGithubTokenChange(e.target.value)}
              placeholder="ghp_..."
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Generate a token in your{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub settings
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Docker API</CardTitle>
          <CardDescription>
            Set up Docker integration for container management and deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="docker-token">API Token</Label>
            <Input
              id="docker-token"
              type="password"
              value={dockerToken}
              onChange={(e) => onDockerTokenChange(e.target.value)}
              placeholder="Enter Docker API token"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}