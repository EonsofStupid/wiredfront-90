
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExternalLink, Github } from "lucide-react";
import { APIKeyManagement } from "./APIKeyManagement";
import { useRoleStore } from "@/stores/role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DevelopmentSettingsProps {
  githubToken: string;
  dockerToken: string;
  onGithubTokenChange: (value: string) => void;
  onDockerTokenChange: (value: string) => void;
}

export function DevelopmentSettings({
  githubToken,
  dockerToken,
  onGithubTokenChange,
  onDockerTokenChange
}: DevelopmentSettingsProps) {
  const { hasRole } = useRoleStore();
  const canManageKeys = hasRole('super_admin');
  const [syncingGithub, setSyncingGithub] = useState(false);

  const handleSyncGithub = async () => {
    if (!githubToken) return;
    
    setSyncingGithub(true);
    try {
      // Simulate API call to sync GitHub metadata
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call to sync GitHub repositories and metadata
      
      // Show success message
      console.log('GitHub repositories synced successfully');
    } catch (error) {
      console.error('Error syncing GitHub repositories:', error);
    } finally {
      setSyncingGithub(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 border-[#8B5CF6]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                <h3 className="font-medium">GitHub Integration</h3>
              </div>
              {githubToken && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  Connected
                </Badge>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                <Input
                  id="githubToken"
                  type="password"
                  value={githubToken}
                  onChange={(e) => onGithubTokenChange(e.target.value)}
                  placeholder="ghp_..."
                  className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
                />
                <p className="text-sm text-muted-foreground flex items-center">
                  <span>Generate a token from</span>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B5CF6] hover:text-[#D946EF] transition-colors ml-1 inline-flex items-center group"
                  >
                    GitHub Developer Settings
                    <ExternalLink className="h-3 w-3 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </p>
              </div>
              
              {githubToken && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncGithub}
                  disabled={syncingGithub}
                  className="w-full mt-2"
                >
                  {syncingGithub ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
                      Syncing...
                    </>
                  ) : (
                    'Sync Repositories'
                  )}
                </Button>
              )}
            </div>
          </Card>
          
          <Card className="p-5 border-[#8B5CF6]/20">
            <div className="flex items-center mb-4">
              <h3 className="font-medium">Docker Integration</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dockerToken">Docker Hub API Token</Label>
              <Input
                id="dockerToken"
                type="password"
                value={dockerToken}
                onChange={(e) => onDockerTokenChange(e.target.value)}
                placeholder="dckr_pat_..."
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
              />
              <p className="text-sm text-muted-foreground flex items-center">
                <span>Create a token in your</span>
                <a
                  href="https://hub.docker.com/settings/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B5CF6] hover:text-[#D946EF] transition-colors ml-1 inline-flex items-center group"
                >
                  Docker Hub Security settings
                  <ExternalLink className="h-3 w-3 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </p>
            </div>
          </Card>
        </div>
        
        <div className="border-t pt-6 mt-4">
          {canManageKeys && <APIKeyManagement />}
        </div>
      </div>
    </div>
  );
}
