
import { Button } from "@/components/ui/button";
import { AlertCircle, Github, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GitHubIntegrationStepProps {
  projectName: string;
  isGithubConnected: boolean;
  githubUsername: string | null;
  onPrevious: () => void;
  onContinue: () => void;
  isSubmitting: boolean;
}

export function GitHubIntegrationStep({
  projectName,
  isGithubConnected,
  githubUsername,
  onPrevious,
  onContinue,
  isSubmitting
}: GitHubIntegrationStepProps) {
  return (
    <div className="space-y-4">
      {!isGithubConnected ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>GitHub Not Connected</AlertTitle>
          <AlertDescription>
            You need to connect your GitHub account in Settings to enable GitHub integration.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="rounded-md border p-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-neon-blue" />
              <div>
                <h3 className="text-sm font-medium">GitHub Repository</h3>
                <p className="text-sm text-muted-foreground">Connected as @{githubUsername}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Repository Name:</span> {projectName}
              </div>
              <div className="text-sm">
                <span className="font-medium">Visibility:</span> Private
              </div>
              <div className="text-sm">
                <span className="font-medium">Owner:</span> @{githubUsername}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            We'll create a new GitHub repository for your project. 
            The repository will be private by default.
          </p>
        </>
      )}
      
      <div className="pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button 
          onClick={onContinue}
          disabled={!isGithubConnected || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Repository...
            </>
          ) : (
            "Create Repository"
          )}
        </Button>
      </div>
    </div>
  );
}
