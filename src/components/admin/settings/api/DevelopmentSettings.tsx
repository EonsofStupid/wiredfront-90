
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";
import { APIKeyManagement } from "./APIKeyManagement";
import { useRoleStore } from "@/stores/role";

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
  const [showSecureKeyForm, setShowSecureKeyForm] = useState(false);
  const { hasRole } = useRoleStore();
  const canManageKeys = hasRole('super_admin');

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
        
        <div className="border-t pt-6 mt-4">
          {canManageKeys && <APIKeyManagement />}
        </div>
      </div>
    </div>
  );
}
