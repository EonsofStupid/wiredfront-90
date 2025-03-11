
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Github, Key, Shield } from "lucide-react";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { APIType } from "@/types/admin/settings/api";

export function ApiSettings() {
  const [githubToken, setGithubToken] = useState("");
  const [tokenName, setTokenName] = useState("primary_github_token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createApiKey, configurations } = useAPIKeyManagement();
  
  // Check if a GitHub token already exists, now using the updated type
  const hasGitHubToken = configurations.some(config => config.api_type === 'github' as APIType);
  
  const handleSaveGitHubToken = async () => {
    if (!githubToken) {
      toast.error("Please enter a GitHub token");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createApiKey(
        'github' as APIType,
        tokenName,
        githubToken,
        {
          feature_bindings: ['github_sync'],
          rag_preference: 'supabase',
          planning_mode: 'basic'
        },
        ['developer', 'user'],
        []
      );
      
      setGithubToken("");
      toast.success("GitHub token saved successfully!");
    } catch (error) {
      console.error("Error saving GitHub token:", error);
      toast.error("Failed to save GitHub token");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">API Settings</h2>
        <p className="text-muted-foreground">
          Configure API tokens for integration with external services
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Integration
            </CardTitle>
            <CardDescription>
              Connect to GitHub for repository access and code management
            </CardDescription>
          </div>
          {hasGitHubToken && (
            <Shield className="h-5 w-5 text-green-500" />
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {hasGitHubToken ? (
            <Alert className="bg-green-500/10 border-green-500/30 text-green-600">
              <Shield className="h-4 w-4" />
              <AlertTitle>GitHub Connected</AlertTitle>
              <AlertDescription>
                Your GitHub token is securely stored. You can manage your tokens in the settings.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className="mb-4 border-amber-500/40 bg-amber-500/10 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>GitHub Token Required</AlertTitle>
                <AlertDescription>
                  Add a GitHub personal access token to enable repository access and code syncing.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenName">Token Name</Label>
                  <Input
                    id="tokenName"
                    placeholder="e.g., primary_github_token"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                  <Input
                    id="githubToken"
                    type="password"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a token with <code>repo</code> and <code>read:user</code> scopes.
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveGitHubToken}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Saving..." : "Save GitHub Token"}
                </Button>
              </div>
            </>
          )}
          
          <div className="mt-4 pt-4 border-t border-border">
            <a 
              href="https://github.com/settings/tokens?type=beta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 text-primary hover:underline"
            >
              <Key className="h-3 w-3" />
              Generate a new GitHub token
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
