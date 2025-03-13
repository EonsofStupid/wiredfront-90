
import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";

interface ProjectActionsProps {
  onAddProject: () => void;
}

export function ProjectActions({ onAddProject }: ProjectActionsProps) {
  return (
    <div className="w-full space-y-2">
      <Button
        variant="default"
        className="w-full justify-start gap-2"
        onClick={onAddProject}
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
      >
        <Import className="h-4 w-4" />
        Import Project
      </Button>
    </div>
  );
}
