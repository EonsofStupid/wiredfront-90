
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { GitHubConnectedView } from "./components/GitHubConnectedView";
import { GitHubNotConnectedView } from "./components/GitHubNotConnectedView";
import { useGitHubToken } from "./hooks/useGitHubToken";
import { GitHubSettingsProps } from "./types/github-settings";

export function GitHubSettings({ githubToken, onGithubTokenChange }: GitHubSettingsProps) {
  const [newGithubToken, setNewGithubToken] = useState("");
  const {
    isSaving,
    isValidating,
    isValid,
    metrics,
    githubUsername,
    validateGithubToken,
    saveGithubToken,
    syncGithubMetrics
  } = useGitHubToken();

  const handleSaveToken = async () => {
    await saveGithubToken(newGithubToken, onGithubTokenChange);
    setNewGithubToken("");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <CardDescription>
          Connect your GitHub account to enable repository access and code generation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {githubToken ? (
          <GitHubConnectedView 
            githubUsername={githubUsername}
            metrics={metrics}
            isValidating={isValidating}
            syncGithubMetrics={syncGithubMetrics}
            validateGithubToken={validateGithubToken}
            token={githubToken}
          />
        ) : (
          <GitHubNotConnectedView
            newGithubToken={newGithubToken}
            setNewGithubToken={setNewGithubToken}
            isValidating={isValidating}
            validateGithubToken={validateGithubToken}
          />
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        {!githubToken && (
          <Button
            onClick={handleSaveToken}
            disabled={isSaving || !isValid}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Github className="h-4 w-4 mr-2" />
                Save GitHub Token
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
