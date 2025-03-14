
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProjectDetails {
  name: string;
  description: string;
  isImporting: boolean;
}

interface ProjectDetailsStepProps {
  projectDetails: ProjectDetails;
  setProjectDetails: (details: ProjectDetails) => void;
}

export function ProjectDetailsStep({
  projectDetails,
  setProjectDetails
}: ProjectDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          value={projectDetails.name}
          onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
          placeholder="My Awesome Project"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project-description">Description (Optional)</Label>
        <Textarea
          id="project-description"
          value={projectDetails.description}
          onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
          placeholder="A short description of your project"
          rows={3}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2 pt-2">
        <Label htmlFor="import-project" className="cursor-pointer">Import existing project</Label>
        <Switch
          id="import-project"
          checked={projectDetails.isImporting}
          onCheckedChange={(checked) => setProjectDetails({ ...projectDetails, isImporting: checked })}
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        {projectDetails.isImporting ? (
          <p>
            Choose this option if you want to import an existing project from GitHub.
            You'll be able to specify the repository URL in the next step.
          </p>
        ) : (
          <p>
            We'll create a new repository for your project.
            You'll be able to customize the repository details in the next step.
          </p>
        )}
      </div>
    </div>
  );
}
