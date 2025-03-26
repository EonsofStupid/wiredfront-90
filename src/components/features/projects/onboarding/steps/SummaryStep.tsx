
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Import, Plus } from "lucide-react";

interface ProjectDetails {
  name: string;
  description: string;
  isImporting: boolean;
}

interface RepoDetails {
  repoName: string;
  repoUrl: string;
  isPrivate: boolean;
}

interface SummaryStepProps {
  projectDetails: ProjectDetails;
  repoDetails: RepoDetails;
}

export function SummaryStep({
  projectDetails,
  repoDetails
}: SummaryStepProps) {
  const repoName = repoDetails.repoName || projectDetails.name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Project Summary</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-primary" />
                <p className="font-medium">Project Name:</p>
              </div>
              <p>{projectDetails.name}</p>
            </div>
            
            {projectDetails.description && (
              <div className="space-y-1">
                <p className="font-medium">Description:</p>
                <p className="text-sm text-muted-foreground">{projectDetails.description}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-primary" />
                <p className="font-medium">GitHub Repository:</p>
              </div>
              {projectDetails.isImporting ? (
                <div className="flex items-center space-x-2">
                  <Import className="h-4 w-4 text-muted-foreground" />
                  <p>Importing from: {repoDetails.repoUrl}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>{repoName}</p>
                  <Badge variant={repoDetails.isPrivate ? "secondary" : "outline"}>
                    {repoDetails.isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Please review the details above. Click "Create Project" to finalize your project setup.
        </p>
      </div>
    </div>
  );
}
