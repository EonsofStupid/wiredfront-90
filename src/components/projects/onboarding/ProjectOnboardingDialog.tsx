
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingSteps } from "./OnboardingSteps";
import { ProjectDetailsStep } from "./steps/ProjectDetailsStep";
import { GitHubIntegrationStep } from "./steps/GitHubIntegrationStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useProjectActivation } from "@/hooks/projects/useProjectActivation";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";

export type ProjectType = "new" | "import";

interface ProjectFormData {
  name: string;
  description: string;
  projectType: ProjectType;
  githubIntegration: boolean;
}

interface ProjectOnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (projectId: string) => void;
}

export function ProjectOnboardingDialog({ 
  isOpen, 
  onClose, 
  onComplete 
}: ProjectOnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    projectType: "new",
    githubIntegration: false
  });
  
  const { toast } = useToast();
  const { 
    notifyProjectCreated, 
    notifyProjectImported 
  } = useProjectActivation();
  const { 
    isConnected: isGithubConnected,
    username: githubUsername
  } = useGitHubConnection();

  const steps = [
    "Project Details",
    "GitHub Integration",
    "Complete"
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      projectType: "new",
      githubIntegration: false
    });
    setCurrentStep(0);
    setProjectId(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    
    try {
      // Create the project in the database
      const { data: projectData, error } = await supabase
        .from("projects")
        .insert({
          name: formData.name,
          description: formData.description || null,
          status: "active"
        })
        .select()
        .single();

      if (error) throw error;
      
      // Store the project ID
      setProjectId(projectData.id);

      // Notify the system about the new project
      if (formData.projectType === "new") {
        await notifyProjectCreated(supabase.auth.getUser().then(res => res.data.user?.id || ""), projectData.id);
      } else {
        await notifyProjectImported(supabase.auth.getUser().then(res => res.data.user?.id || ""), projectData.id);
      }

      // If GitHub integration is enabled and the user chose a new project, create a GitHub repo
      if (formData.githubIntegration && formData.projectType === "new" && isGithubConnected) {
        nextStep(); // Move to GitHub integration step
      } else {
        // Skip to completion step
        setCurrentStep(steps.length - 1);
      }
      
      toast({
        title: "Project created successfully",
        description: `Your project "${formData.name}" has been created.`
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        variant: "destructive",
        title: "Error creating project",
        description: error.message || "An unknown error occurred."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGithubRepo = async () => {
    if (!projectId) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "create-repo", 
          payload: {
            userId,
            projectId,
            projectName: formData.name,
            description: formData.description
          }
        }
      });

      if (response.error) throw new Error(response.error.message || "Failed to create GitHub repository");
      
      toast({
        title: "GitHub repository created",
        description: "Your project has been linked to a new GitHub repository."
      });
      
      // Move to completion step
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error creating GitHub repository:", error);
      toast({
        variant: "destructive",
        title: "GitHub repository creation failed",
        description: error.message || "Failed to create GitHub repository. Please try again later."
      });
      
      // Still move to completion step, but the GitHub repo creation failed
      setCurrentStep(steps.length - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    if (projectId) {
      onComplete(projectId);
    }
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Project Setup</DialogTitle>
          <DialogDescription>
            {currentStep === 0 && "Create a new project or import an existing one."}
            {currentStep === 1 && "Set up GitHub integration for your project."}
            {currentStep === 2 && "Your project is ready!"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <OnboardingSteps 
            steps={steps} 
            currentStep={currentStep} 
          />

          <div className="mt-6">
            {currentStep === 0 && (
              <ProjectDetailsStep
                formData={formData}
                onChange={setFormData}
                onSubmit={handleCreateProject}
                isSubmitting={isSubmitting}
              />
            )}
            
            {currentStep === 1 && (
              <GitHubIntegrationStep
                projectName={formData.name}
                isGithubConnected={isGithubConnected}
                githubUsername={githubUsername}
                onPrevious={prevStep}
                onContinue={handleCreateGithubRepo}
                isSubmitting={isSubmitting}
              />
            )}
            
            {currentStep === 2 && (
              <CompletionStep
                projectName={formData.name}
                projectType={formData.projectType}
                hasGithubRepo={formData.githubIntegration && isGithubConnected}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
