import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

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
  const [memorableName, setMemorableName] = useState("");

  const handleSaveToken = async (tokenType: 'github' | 'docker', value: string) => {
    if (!memorableName) {
      toast.error("Please provide a memorable name for your token");
      return;
    }

    try {
      const secretName = `${tokenType.toUpperCase()}_${memorableName}`;
      
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          secretName,
          secretValue: value,
          provider: tokenType,
          memorableName
        }
      });

      if (error) {
        console.error('Error saving token:', error);
        throw new Error(error.message || 'Failed to save token');
      }

      if (!data?.success) {
        throw new Error('Failed to save token');
      }

      toast.success(`${tokenType.toUpperCase()} token saved successfully as ${memorableName}`);
      setMemorableName(""); // Reset the memorable name field
    } catch (error) {
      console.error('Error saving token:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save token");
    }
  };

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
            <Label htmlFor="github-token-name">Token Name</Label>
            <Input
              id="github-token-name"
              placeholder="e.g., github-main-prod"
              value={memorableName}
              onChange={(e) => setMemorableName(e.target.value)}
            />
          </div>
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
          <Button 
            onClick={() => handleSaveToken('github', githubToken)}
            className="w-full"
          >
            Save GitHub Token
          </Button>
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
            <Label htmlFor="docker-token-name">Token Name</Label>
            <Input
              id="docker-token-name"
              placeholder="e.g., docker-prod"
              value={memorableName}
              onChange={(e) => setMemorableName(e.target.value)}
            />
          </div>
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
          <Button 
            onClick={() => handleSaveToken('docker', dockerToken)}
            className="w-full"
          >
            Save Docker Token
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}