
import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectOnboardingDialog } from "./onboarding/ProjectOnboardingDialog";
import { useUIStore } from "@/stores";
import { useToast } from "@/components/ui/use-toast";

interface ProjectActionsProps {
  onAddProject: () => void;
}

export function ProjectActions({ onAddProject }: ProjectActionsProps) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const { setActiveProject } = useUIStore();
  const { toast } = useToast();

  const handleProjectCreated = (projectId: string) => {
    setActiveProject(projectId);
    onAddProject();
  };

  const openOnboarding = (importMode: boolean) => {
    setIsImportMode(importMode);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="w-full space-y-2">
      <Button
        variant="default"
        className="w-full justify-start gap-2"
        onClick={() => openOnboarding(false)}
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => openOnboarding(true)}
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
