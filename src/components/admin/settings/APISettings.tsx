// Move from src/components/settings/APISettings.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";
import { VoiceSettings } from "./api/VoiceSettings";
import { RAGKeysSettings } from "./api/RAGKeysSettings";
import { OAuthConnectionsSettings } from "./api/oauth/OAuthConnectionsSettings";
import { useAPISettings } from "@/hooks/settings/api";
import { toast } from "sonner";

export function APISettings() {
  const {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user
  } = useAPISettings();

  const onSave = async () => {
    try {
      await handleSave();
      toast.success("API settings saved successfully");
    } catch (error) {
      console.error('Failed to save API settings:', error);
      toast.error("Failed to save API settings. Please try again.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your API keys and tokens for various services.
        </p>
      </div>

      <Tabs defaultValue="ai-services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-services">AI Services</TabsTrigger>
          <TabsTrigger value="oauth">OAuth Connections</TabsTrigger>
          <TabsTrigger value="rag-keys">Vector DB Keys</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <AIServicesSettings />
        </TabsContent>

        <TabsContent value="oauth">
          <OAuthConnectionsSettings />
        </TabsContent>

        <TabsContent value="rag-keys">
          <RAGKeysSettings />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceSettings
            elevenLabsKey={settings.elevenLabsKey}
            onElevenLabsKeyChange={(value) => updateSetting('elevenLabsKey', value)}
            selectedVoice={settings.selectedVoice}
            onVoiceChange={(value) => updateSetting('selectedVoice', value)}
          />
        </TabsContent>

        <TabsContent value="cloud-storage">
          <CloudStorageSettings
            googleDriveKey={settings.googleDriveKey}
            dropboxKey={settings.dropboxKey}
            awsAccessKey={settings.awsAccessKey}
            awsSecretKey={settings.awsSecretKey}
            onGoogleDriveKeyChange={(value) => updateSetting('googleDriveKey', value)}
            onDropboxKeyChange={(value) => updateSetting('dropboxKey', value)}
            onAwsAccessKeyChange={(value) => updateSetting('awsAccessKey', value)}
            onAwsSecretKeyChange={(value) => updateSetting('awsSecretKey', value)}
          />
        </TabsContent>

        <TabsContent value="development">
          <DevelopmentSettings
            githubToken={settings.githubToken}
            dockerToken={settings.dockerToken}
            onGithubTokenChange={(value) => updateSetting('githubToken', value)}
            onDockerTokenChange={(value) => updateSetting('dockerToken', value)}
          />
        </TabsContent>
      </Tabs>

      <Button 
        onClick={onSave}
        disabled={isSaving}
        className="w-full md:w-auto"
      >
        {isSaving ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Saving...
          </span>
        ) : (
          "Save API Settings"
        )}
      </Button>
    </div>
  );
}
