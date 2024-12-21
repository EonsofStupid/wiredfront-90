import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";
import { useNavigate } from "react-router-dom";

interface SettingValue {
  key: string;
}

// Type guard to check if a value is a SettingValue
function isSettingValue(value: unknown): value is SettingValue {
  return (
    typeof value === 'object' && 
    value !== null && 
    'key' in value && 
    typeof (value as SettingValue).key === 'string'
  );
}

export function APISettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // AI Services
  const [openaiKey, setOpenaiKey] = useState("");
  const [huggingfaceKey, setHuggingfaceKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [alexaKey, setAlexaKey] = useState("");
  const [cortanaKey, setCortanaKey] = useState("");

  // Cloud Storage
  const [googleDriveKey, setGoogleDriveKey] = useState("");
  const [dropboxKey, setDropboxKey] = useState("");
  const [awsAccessKey, setAwsAccessKey] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");

  // Development
  const [githubToken, setGithubToken] = useState("");
  const [dockerToken, setDockerToken] = useState("");

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage API settings.",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }
      setUser(session.user);

      // Load existing settings
      if (session.user) {
        try {
          const { data: settings, error } = await supabase
            .from('user_settings')
            .select('setting_id, value')
            .eq('user_id', session.user.id);

          if (error) throw error;

          if (settings) {
            settings.forEach(setting => {
              if (!isSettingValue(setting.value)) return;
              
              switch (setting.setting_id) {
                case 'openai-api-key': setOpenaiKey(setting.value.key); break;
                case 'huggingface-api-key': setHuggingfaceKey(setting.value.key); break;
                case 'gemini-api-key': setGeminiKey(setting.value.key); break;
                case 'alexa-api-key': setAlexaKey(setting.value.key); break;
                case 'cortana-api-key': setCortanaKey(setting.value.key); break;
                case 'google-drive-api-key': setGoogleDriveKey(setting.value.key); break;
                case 'dropbox-api-key': setDropboxKey(setting.value.key); break;
                case 'aws-access-key': setAwsAccessKey(setting.value.key); break;
                case 'aws-secret-key': setAwsSecretKey(setting.value.key); break;
                case 'github-token': setGithubToken(setting.value.key); break;
                case 'docker-token': setDockerToken(setting.value.key); break;
              }
            });
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          toast({
            title: "Error",
            description: "Failed to load API settings.",
            variant: "destructive"
          });
        }
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save API settings.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      const apiKeys = {
        'openai-api-key': openaiKey,
        'huggingface-api-key': huggingfaceKey,
        'gemini-api-key': geminiKey,
        'alexa-api-key': alexaKey,
        'cortana-api-key': cortanaKey,
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
              user_id: user.id,
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
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <AIServicesSettings
            openaiKey={openaiKey}
            huggingfaceKey={huggingfaceKey}
            geminiKey={geminiKey}
            alexaKey={alexaKey}
            cortanaKey={cortanaKey}
            onOpenAIKeyChange={setOpenaiKey}
            onHuggingfaceKeyChange={setHuggingfaceKey}
            onGeminiKeyChange={setGeminiKey}
            onAlexaKeyChange={setAlexaKey}
            onCortanaKeyChange={setCortanaKey}
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
};
