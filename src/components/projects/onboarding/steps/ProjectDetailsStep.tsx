
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProjectType } from "../ProjectOnboardingDialog";
import { Loader2 } from "lucide-react";

interface ProjectFormData {
  name: string;
  description: string;
  projectType: ProjectType;
  githubIntegration: boolean;
}

interface ProjectDetailsStepProps {
  formData: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ProjectDetailsStep({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: ProjectDetailsStepProps) {
  const isFormValid = formData.name.trim().length > 0;

  const handleInputChange = (field: keyof ProjectFormData, value: string | boolean) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="My Awesome Project"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="A brief description of your project"
          className="resize-none"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Project Type</Label>
        <RadioGroup 
          value={formData.projectType} 
          onValueChange={(value) => handleInputChange("projectType", value as ProjectType)}
          className="flex flex-col space-y-2"
          disabled={isSubmitting}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="cursor-pointer">New Project</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="import" id="import" />
            <Label htmlFor="import" className="cursor-pointer">Import Existing Project</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="githubIntegration"
            checked={formData.githubIntegration}
            onChange={(e) => handleInputChange("githubIntegration", e.target.checked)}
            className="rounded text-neon-blue focus:ring-neon-blue"
            disabled={isSubmitting}
          />
          <Label htmlFor="githubIntegration" className="cursor-pointer">
            Enable GitHub Integration
          </Label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          {formData.projectType === "new" 
            ? "Create a new GitHub repository for this project" 
            : "Link this project to an existing GitHub repository"}
        </p>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={onSubmit} 
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
