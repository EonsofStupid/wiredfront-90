
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { KnownFeatureFlag } from '@/types/admin/settings/feature-flags';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ChatProviderSettingsProps {
  title?: string;
  description?: string;
}

export const ChatProviderSettings: React.FC<ChatProviderSettingsProps> = ({
  title = 'Chat Provider Settings',
  description = 'Configure chat provider settings and features',
}) => {
  const { features, toggleFeature, isUpdating } = useFeatureFlags();

  const handleReset = () => {
    // Reset all features to default
    if (!features.codeAssistant) toggleFeature(KnownFeatureFlag.CODE_ASSISTANT);
    if (!features.ragSupport) toggleFeature(KnownFeatureFlag.RAG_SUPPORT);
    if (!features.githubSync) toggleFeature(KnownFeatureFlag.GITHUB_SYNC);
    if (!features.notifications) toggleFeature(KnownFeatureFlag.NOTIFICATIONS);
    
    toast.success("Chat features reset to defaults");
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <p className="text-muted-foreground mb-4">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Features</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="codeAssistant">Code Assistant</Label>
              <p className="text-sm text-muted-foreground">
                Enable code assistance features
              </p>
            </div>
            <Switch 
              id="codeAssistant" 
              checked={features.codeAssistant} 
              onCheckedChange={() => toggleFeature(KnownFeatureFlag.CODE_ASSISTANT)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ragSupport">RAG Support</Label>
              <p className="text-sm text-muted-foreground">
                Enable retrieval augmented generation
              </p>
            </div>
            <Switch 
              id="ragSupport" 
              checked={features.ragSupport} 
              onCheckedChange={() => toggleFeature(KnownFeatureFlag.RAG_SUPPORT)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="githubSync">GitHub Sync</Label>
              <p className="text-sm text-muted-foreground">
                Enable GitHub integration in editor mode
              </p>
            </div>
            <Switch 
              id="githubSync" 
              checked={features.githubSync} 
              onCheckedChange={() => toggleFeature(KnownFeatureFlag.GITHUB_SYNC)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable notification features
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={features.notifications} 
              onCheckedChange={() => toggleFeature(KnownFeatureFlag.NOTIFICATIONS)}
              disabled={isUpdating}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleReset} 
          variant="outline" 
          className="w-full"
          disabled={isUpdating}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </Card>
  );
};
