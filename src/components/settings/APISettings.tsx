import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";
import { VoiceSettings } from "./api/VoiceSettings";
import { useNavigate } from "react-router-dom";

interface SettingValue {
  key: string;
}

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
  const [anthropicKey, setAnthropicKey] = useState("");
  const [perplexityKey, setPerplexityKey] = useState("");

  // Voice Services
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");

  // Cloud Storage
  const [googleDriveKey, setGoogleDriveKey] = useState("");
  const [dropboxKey, setDropboxKey] = useState("");
  const [awsAccessKey, setAwsAccessKey] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");

  // Development
  const [githubToken, setGithubToken] = useState("");
  const [dockerToken, setDockerToken] = useState("");

  useEffect(() => {
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

      if (session.user) {
        try {
          // First, get all settings to get their UUIDs
          const { data: allSettings, error: settingsError } = await supabase
            .from('settings')
            .select('id, key');
          
          if (settingsError) throw settingsError;

          // Create a map of setting keys to their UUIDs
          const settingKeyToId = allSettings?.reduce((acc: Record<string, string>, setting) => {
            acc[setting.key] = setting.id;
            return acc;
          }, {}) || {};

          // Then get user settings
          const { data: userSettings, error: userSettingsError } = await supabase
            .from('user_settings')
            .select('setting_id, value')
            .eq('user_id', session.user.id);

          if (userSettingsError) throw userSettingsError;

          if (userSettings) {
            userSettings.forEach(setting => {
              if (!isSettingValue(setting.value)) return;
              
              // Find the setting key by UUID
              const settingKey = Object.entries(settingKeyToId).find(
                ([_, id]) => id === setting.setting_id
              )?.[0];

              if (!settingKey) return;

              switch (settingKey) {
                case 'openai-api-key': setOpenaiKey(setting.value.key); break;
                case 'huggingface-api-key': setHuggingfaceKey(setting.value.key); break;
                case 'gemini-api-key': setGeminiKey(setting.value.key); break;
                case 'anthropic-api-key': setAnthropicKey(setting.value.key); break;
                case 'perplexity-api-key': setPerplexityKey(setting.value.key); break;
                case 'elevenlabs-api-key': setElevenLabsKey(setting.value.key); break;
                case 'elevenlabs-voice': setSelectedVoice(setting.value.key); break;
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
      // First, get all settings to get their UUIDs
      const { data: allSettings, error: settingsError } = await supabase
        .from('settings')
        .select('id, key');
      
      if (settingsError) throw settingsError;

      // Create a map of setting keys to their UUIDs
      const settingKeyToId = allSettings?.reduce((acc: Record<string, string>, setting) => {
        acc[setting.key] = setting.id;
        return acc;
      }, {}) || {};

      const apiKeys = {
        'openai-api-key': openaiKey,
        'huggingface-api-key': huggingfaceKey,
        'gemini-api-key': geminiKey,
        'anthropic-api-key': anthropicKey,
        'perplexity-api-key': perplexityKey,
        'elevenlabs-api-key': elevenLabsKey,
        'elevenlabs-voice': selectedVoice,
        'google-drive-api-key': googleDriveKey,
        'dropbox-api-key': dropboxKey,
        'aws-access-key': awsAccessKey,
        'aws-secret-key': awsSecretKey,
        'github-token': githubToken,
        'docker-token': dockerToken,
      };

      for (const [key, value] of Object.entries(apiKeys)) {
        if (value && settingKeyToId[key]) {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              setting_id: settingKeyToId[key],
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
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-services">
          <AIServicesSettings
            openaiKey={openaiKey}
            huggingfaceKey={huggingfaceKey}
            geminiKey={geminiKey}
            anthropicKey={anthropicKey}
            perplexityKey={perplexityKey}
            onOpenAIKeyChange={setOpenaiKey}
            onHuggingfaceKeyChange={setHuggingfaceKey}
            onGeminiKeyChange={setGeminiKey}
            onAnthropicKeyChange={setAnthropicKey}
            onPerplexityKeyChange={setPerplexityKey}
          />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceSettings
            elevenLabsKey={elevenLabsKey}
            onElevenLabsKeyChange={setElevenLabsKey}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
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