
import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectOnboardingDialog } from "./onboarding/ProjectOnboardingDialog";
import { useUIStore } from "@/stores";

interface ProjectActionsProps {
  onAddProject: () => void;
}

export function ProjectActions({ onAddProject }: ProjectActionsProps) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const { setActiveProject } = useUIStore();

  const handleProjectCreated = (projectId: string) => {
    setActiveProject(projectId);
    onAddProject();
  };

  return (
    <div className="w-full space-y-2">
      <Button
        variant="default"
        className="w-full justify-start gap-2"
        onClick={() => setIsOnboardingOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsOnboardingOpen(true)}
      >
        <Import className="h-4 w-4" />
        Import Project
      </Button>

      <ProjectOnboardingDialog
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleProjectCreated}
      />
    </div>
  );
}
