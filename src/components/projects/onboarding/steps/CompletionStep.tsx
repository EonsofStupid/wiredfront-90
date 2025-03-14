
import { Button } from "@/components/ui/button";
import { CheckCircle2, Github } from "lucide-react";
import { ProjectType } from "../ProjectOnboardingDialog";

interface CompletionStepProps {
  projectName: string;
  projectType: ProjectType;
  hasGithubRepo: boolean;
  onComplete: () => void;
}

export function CompletionStep({
  projectName,
  projectType,
  hasGithubRepo,
  onComplete
}: CompletionStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          {projectType === "new" ? "Project Created!" : "Project Imported!"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {`Your project "${projectName}" has been successfully ${projectType === "new" ? "created" : "imported"}.`}
        </p>
      </div>

      {hasGithubRepo && (
        <div className="rounded-md border p-3 bg-muted/50 mx-auto max-w-xs">
          <div className="flex items-center justify-center gap-2">
            <Github className="h-4 w-4 text-neon-blue" />
            <span className="text-sm">GitHub repository created</span>
          </div>
        </div>
      )}
      
      <div className="pt-4">
        <Button onClick={onComplete}>
          Continue to Project
        </Button>
      </div>
    </div>
  );
}
