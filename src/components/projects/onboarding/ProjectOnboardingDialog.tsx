
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { OnboardingSteps } from "./OnboardingSteps";
import { ProjectDetailsStep } from "./steps/ProjectDetailsStep";
import { RepositoryStep } from "./steps/RepositoryStep";
import { SummaryStep } from "./steps/SummaryStep";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { ProjectEventService } from "@/services/project/ProjectEventService";
import { GitHubIntegrationStep } from "./steps/GitHubIntegrationStep";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { isConnected, connectionStatus } = useGitHubConnection();
  
  // Extract username from metadata if available
  const githubUsername = connectionStatus.metadata?.username || null;
  
  // Form state
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    isImporting: false
  });
  
  const [repoDetails, setRepoDetails] = useState({
    repoName: "",
    repoUrl: "",
    isPrivate: true
  });

  const steps = projectDetails.isImporting 
    ? ["Project Details", "Repository Setup", "Summary"] 
    : ["Project Details", "Repository Setup", "GitHub Integration", "Summary"];

  const handleNextStep = () => {
    if (currentStep === 0 && !projectDetails.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 1 && !projectDetails.isImporting && !repoDetails.repoName.trim()) {
      toast({
        title: "Repository name required",
        description: "Please enter a name for your repository",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setProjectDetails({
      name: "",
      description: "",
      isImporting: false
    });
    setRepoDetails({
      repoName: "",
      repoUrl: "",
      isPrivate: true
    });
    onClose();
  };

  const createGitHubRepo = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("github-repo-management", {
        body: {
          action: "create",
          name: repoDetails.repoName || projectDetails.name,
          isPrivate: repoDetails.isPrivate,
          description: projectDetails.description
        }
      });
      
      if (error) throw error;
      return data.repoUrl || "";
    } catch (error) {
      console.error("Error creating GitHub repo:", error);
      toast({
        title: "GitHub Repository Creation Failed",
        description: "Could not create a GitHub repository. Please try again later.",
        variant: "destructive"
      });
      return "";
    }
  };

  const handleCreateProject = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let githubRepoUrl = "";
      
      // If not importing, create a new GitHub repo
      if (!projectDetails.isImporting) {
        githubRepoUrl = await createGitHubRepo();
        if (!githubRepoUrl && !projectDetails.isImporting) {
          throw new Error("Failed to create GitHub repository");
        }
      } else if (repoDetails.repoUrl) {
        githubRepoUrl = repoDetails.repoUrl;
      }
      
      // Create project in Supabase
      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          name: projectDetails.name,
          description: projectDetails.description,
          user_id: user.id,
          github_repo: githubRepoUrl,
          is_active: true,
          tech_stack: JSON.stringify({ primaryLanguage: "unknown" }) // Will be updated during indexing
        })
        .select("id")
        .single();
      
      if (error) throw error;
      
      // Log project creation event
      await ProjectEventService.logProjectCreation(project.id, {
        projectName: projectDetails.name,
        hasGithubRepo: !!githubRepoUrl,
        isImported: projectDetails.isImporting
      });
      
      // Start indexing the repository for RAG if a GitHub repo was connected
      if (githubRepoUrl) {
        try {
          await supabase.functions.invoke("github-repo-management", {
            body: { 
              action: "index-repo", 
              projectId: project.id,
              repoFullName: githubRepoUrl.replace("https://github.com/", "")
            }
          });
        } catch (indexError) {
          console.error("Error starting repository indexing:", indexError);
          // We don't fail the project creation if indexing fails
        }
      }
      
      toast({
        title: "Project Created",
        description: `${projectDetails.name} has been created successfully`,
      });
      
      onComplete(project.id);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Project Creation Failed",
        description: "Could not create the project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectDetailsStep
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
          />
        );
      case 1:
        return (
          <RepositoryStep
            projectDetails={projectDetails}
            repoDetails={repoDetails}
            setRepoDetails={setRepoDetails}
          />
        );
      case 2:
        // If importing, show summary. Otherwise show GitHub integration
        return projectDetails.isImporting ? (
          <SummaryStep
            projectDetails={projectDetails}
            repoDetails={repoDetails}
          />
        ) : (
          <GitHubIntegrationStep
            projectName={repoDetails.repoName || projectDetails.name.toLowerCase().replace(/\s+/g, '-')}
            isGithubConnected={isConnected}
            githubUsername={githubUsername}
            onPrevious={handlePreviousStep}
            onContinue={handleNextStep}
            isSubmitting={isLoading}
          />
        );
      case 3:
        return (
          <SummaryStep
            projectDetails={projectDetails}
            repoDetails={repoDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <div className="space-y-6">
          <OnboardingSteps steps={steps} currentStep={currentStep} />
          
          <div className="py-4 min-h-[300px]">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? handleClose : handlePreviousStep}
              disabled={isLoading}
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNextStep} 
                disabled={isLoading || (currentStep === 2 && !projectDetails.isImporting && !isConnected)}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleCreateProject} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
