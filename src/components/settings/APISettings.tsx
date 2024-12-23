import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";
import { VoiceSettings } from "./api/VoiceSettings";
import { useAPISettings } from "@/hooks/settings/api";
export function APISettings() {
  const {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user
  } = useAPISettings();

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
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <AIServicesSettings
            openaiKey={settings.openaiKey}
            huggingfaceKey={settings.huggingfaceKey}
            geminiKey={settings.geminiKey}
            anthropicKey={settings.anthropicKey}
            perplexityKey={settings.perplexityKey}
            onOpenAIKeyChange={(value) => updateSetting('openaiKey', value)}
            onHuggingfaceKeyChange={(value) => updateSetting('huggingfaceKey', value)}
            onGeminiKeyChange={(value) => updateSetting('geminiKey', value)}
            onAnthropicKeyChange={(value) => updateSetting('anthropicKey', value)}
            onPerplexityKeyChange={(value) => updateSetting('perplexityKey', value)}
          />
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
        onClick={handleSave}
        disabled={isSaving}
        className="w-full md:w-auto"
      >
        {isSaving ? "Saving..." : "Save API Settings"}
      </Button>
    </div>
  );
}
