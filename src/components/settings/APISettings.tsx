import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";

export function APISettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // AI Services
  const [openaiKey, setOpenaiKey] = useState("");
  const [huggingfaceKey, setHuggingfaceKey] = useState("");

  // Cloud Storage
  const [googleDriveKey, setGoogleDriveKey] = useState("");
  const [dropboxKey, setDropboxKey] = useState("");
  const [awsAccessKey, setAwsAccessKey] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");

  // Development
  const [githubToken, setGithubToken] = useState("");
  const [dockerToken, setDockerToken] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const apiKeys = {
        'openai-api-key': openaiKey,
        'huggingface-api-key': huggingfaceKey,
        'google-drive-api-key': googleDriveKey,
        'dropbox-api-key': dropboxKey,
        'aws-access-key': awsAccessKey,
        'aws-secret-key': awsSecretKey,
        'github-token': githubToken,
        'docker-token': dockerToken,
      };

      for (const [key, value] of Object.entries(apiKeys)) {
        if (value) {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: userId,
              setting_id: key,
              value: { key: value }
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "API settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast({
        title: "Error",
        description: "Failed to save API settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

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
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <AIServicesSettings
            openaiKey={openaiKey}
            huggingfaceKey={huggingfaceKey}
            onOpenAIKeyChange={setOpenaiKey}
            onHuggingfaceKeyChange={setHuggingfaceKey}
          />
        </TabsContent>

        <TabsContent value="cloud-storage">
          <CloudStorageSettings
            googleDriveKey={googleDriveKey}
            dropboxKey={dropboxKey}
            awsAccessKey={awsAccessKey}
            awsSecretKey={awsSecretKey}
            onGoogleDriveKeyChange={setGoogleDriveKey}
            onDropboxKeyChange={setDropboxKey}
            onAwsAccessKeyChange={setAwsAccessKey}
            onAwsSecretKeyChange={setAwsSecretKey}
          />
        </TabsContent>

        <TabsContent value="development">
          <DevelopmentSettings
            githubToken={githubToken}
            dockerToken={dockerToken}
            onGithubTokenChange={setGithubToken}
            onDockerTokenChange={setDockerToken}
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