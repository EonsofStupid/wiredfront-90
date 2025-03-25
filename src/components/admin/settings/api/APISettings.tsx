import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIServicesSettings } from "./AIServicesSettings";
import { CloudStorageSettings } from "./CloudStorageSettings";
import { DevelopmentSettings } from "./DevelopmentSettings";
import { VoiceSettings } from "./VoiceSettings";
import { RAGKeysSettings } from "./RAGKeysSettings";
import { OAuthConnectionsSettings } from "./oauth/OAuthConnectionsSettings";
import { ChatProviderSettings } from "./chat/ChatProviderSettings";
import { useAPISettings } from "@/hooks/admin/settings/api";
import { toast } from "sonner";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { Save, MessageSquare, KeyRound, Shield } from "lucide-react";
import { ChatSettingsTabs } from "../chat/ChatSettingsTabs";
import { APIKeyManagement } from "./APIKeyManagement";
import { useRoleStore } from "@/stores/role";

export function APISettings() {
  const {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user
  } = useAPISettings();
  
  const { hasRole } = useRoleStore();
  const isAdmin = hasRole('super_admin') || hasRole('admin');

  const onSave = async () => {
    try {
      await handleSave();
      toast.success("API settings saved successfully", {
        className: "admin-toast",
        description: "Your API configuration has been updated."
      });
    } catch (error) {
      console.error('Failed to save API settings:', error);
      toast.error("Failed to save API settings", {
        className: "admin-toast admin-toast-error",
        description: "Please try again or check the console for details."
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="admin-container space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight admin-heading">API Settings</h2>
        <p className="text-muted-foreground">
          Configure your API keys and tokens for various services.
        </p>
      </header>

      <AdminCard>
        <AdminCardContent>
          <Tabs defaultValue="ai-services" className="space-y-4">
            <TabsList className="admin-tabs-list">
              <TabsTrigger value="ai-services" className="admin-tab">AI Services</TabsTrigger>
              <TabsTrigger value="chat-providers" className="admin-tab">Chat Providers</TabsTrigger>
              <TabsTrigger value="chat-settings" className="admin-tab">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Settings
              </TabsTrigger>
              {hasRole('super_admin') && (
                <TabsTrigger value="api-keys" className="admin-tab">
                  <KeyRound className="h-4 w-4 mr-2" />
                  API Key Management
                </TabsTrigger>
              )}
              <TabsTrigger value="oauth" className="admin-tab">OAuth Providers</TabsTrigger>
              <TabsTrigger value="rag-keys" className="admin-tab">Vector DB Keys</TabsTrigger>
              <TabsTrigger value="voice" className="admin-tab">Voice</TabsTrigger>
              <TabsTrigger value="cloud-storage" className="admin-tab">Cloud Storage</TabsTrigger>
              <TabsTrigger value="development" className="admin-tab">Development</TabsTrigger>
            </TabsList>

            <TabsContent value="ai-services" className="pt-4">
              <AIServicesSettings />
            </TabsContent>

            <TabsContent value="chat-providers" className="pt-4">
              <ChatProviderSettings />
            </TabsContent>
            
            <TabsContent value="chat-settings" className="pt-4">
              <ChatSettingsTabs />
            </TabsContent>
            
            {hasRole('super_admin') && (
              <TabsContent value="api-keys" className="pt-4">
                <APIKeyManagement />
              </TabsContent>
            )}

            <TabsContent value="oauth" className="pt-4">
              <OAuthConnectionsSettings />
            </TabsContent>

            <TabsContent value="rag-keys" className="pt-4">
              <RAGKeysSettings />
            </TabsContent>

            <TabsContent value="voice" className="pt-4">
              <VoiceSettings
                elevenLabsKey={settings.elevenLabsKey}
                onElevenLabsKeyChange={(value) => updateSetting('elevenLabsKey', value)}
                selectedVoice={settings.selectedVoice}
                onVoiceChange={(value) => updateSetting('selectedVoice', value)}
              />
            </TabsContent>

            <TabsContent value="cloud-storage" className="pt-4">
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

            <TabsContent value="development" className="pt-4">
              <DevelopmentSettings
                githubToken={settings.githubToken}
                dockerToken={settings.dockerToken}
                onGithubTokenChange={(value) => updateSetting('githubToken', value)}
                onDockerTokenChange={(value) => updateSetting('dockerToken', value)}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button 
              onClick={onSave}
              disabled={isSaving}
              className="admin-primary-button group"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Save API Settings
                </span>
              )}
            </Button>
          </div>
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
