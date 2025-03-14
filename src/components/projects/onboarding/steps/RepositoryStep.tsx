
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Github } from "lucide-react";

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

interface RepositoryStepProps {
  projectDetails: ProjectDetails;
  repoDetails: RepoDetails;
  setRepoDetails: (details: RepoDetails) => void;
}

export function RepositoryStep({
  projectDetails,
  repoDetails,
  setRepoDetails
}: RepositoryStepProps) {
  if (projectDetails.isImporting) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <Github className="h-6 w-6" />
          <h3>Import from GitHub</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="repo-url">Repository URL</Label>
          <Input
            id="repo-url"
            value={repoDetails.repoUrl}
            onChange={(e) => setRepoDetails({ ...repoDetails, repoUrl: e.target.value })}
            placeholder="https://github.com/username/repository"
          />
          <p className="text-sm text-muted-foreground">
            Enter the URL of the GitHub repository you want to import.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xl font-semibold">
        <Github className="h-6 w-6" />
        <h3>Create GitHub Repository</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="repo-name">Repository Name</Label>
        <Input
          id="repo-name"
          value={repoDetails.repoName}
          onChange={(e) => setRepoDetails({ ...repoDetails, repoName: e.target.value })}
          placeholder={projectDetails.name.toLowerCase().replace(/\s+/g, '-')}
        />
        <p className="text-sm text-muted-foreground">
          This will be the name of your GitHub repository.
        </p>
      </div>
      
      <div className="flex items-center justify-between space-x-2 pt-2">
        <Label htmlFor="repo-private" className="cursor-pointer">Make repository private</Label>
        <Switch
          id="repo-private"
          checked={repoDetails.isPrivate}
          onCheckedChange={(checked) => setRepoDetails({ ...repoDetails, isPrivate: checked })}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        {repoDetails.isPrivate ? (
          <p>
            Private repositories are only visible to you and people you share them with.
          </p>
        ) : (
          <p>
            Public repositories are visible to anyone on the internet.
          </p>
        )}
      </div>
    </div>
  );
}
