
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CompletionStepProps {
  projectName: string;
  isImporting: boolean;
  repoUrl?: string;
  onComplete: () => void;
}

export function CompletionStep({
  projectName,
  isImporting,
  repoUrl,
  onComplete
}: CompletionStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold">Project Created!</h2>
      
      <p>
        Your project <span className="font-medium">{projectName}</span> has been successfully created.
      </p>
      
      {isImporting ? (
        <p className="text-muted-foreground">
          Your imported project is ready to use.
        </p>
      ) : repoUrl ? (
        <p className="text-muted-foreground">
          A new GitHub repository has been created and linked to your project.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Your project is ready to use.
        </p>
      )}
      
      <Button onClick={onComplete} className="mt-4">
        Start Using Your Project
      </Button>
    </div>
  );
}
