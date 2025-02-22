
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VoiceSettingsProps {
  elevenLabsKey: string;
  onElevenLabsKeyChange: (value: string) => void;
  selectedVoice: string;
  onVoiceChange: (value: string) => void;
}

export function VoiceSettings({
  elevenLabsKey,
  onElevenLabsKeyChange,
  selectedVoice,
  onVoiceChange,
}: VoiceSettingsProps) {
  const voices = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
    { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
    { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
  ];

  const handleSaveAPIKey = async (provider: string, value: string, name: string) => {
    if (!value || !name) {
      toast.error(`Please provide both API key and name for ${provider}`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .insert([{
          api_type: provider.toLowerCase(),
          secret_key_name: `${provider.toUpperCase()}_API_KEY`,
          memorable_name: name,
          is_enabled: true,
          validation_status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error(`Error saving ${provider} configuration:`, error);
        throw new Error(error.message || `Failed to save ${provider} API key`);
      }

      // Now save the actual API key securely using the edge function
      const { error: secretError } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          secretName: `${provider.toUpperCase()}_API_KEY`,
          secretValue: value,
          provider: provider.toLowerCase(),
          memorableName: name
        }
      });

      if (secretError) {
        throw new Error(secretError.message || `Failed to save ${provider} API key`);
      }

      if (provider === 'ElevenLabs') {
        onElevenLabsKeyChange(value);
      }

      toast.success(`${provider} API key saved successfully`);
    } catch (error) {
      console.error(`Error saving ${provider} key:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to save ${provider} API key`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="elevenlabs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="elevenlabs">ElevenLabs</TabsTrigger>
          <TabsTrigger value="whisper">OpenAI Whisper</TabsTrigger>
        </TabsList>

        <TabsContent value="elevenlabs">
          <Card>
            <CardHeader>
              <CardTitle>ElevenLabs Voice API</CardTitle>
              <CardDescription>
                Configure ElevenLabs for text-to-speech capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-name">Configuration Name</Label>
                <Input
                  id="elevenlabs-name"
                  placeholder="Enter a memorable name (e.g. elevenlabs_primary)"
                  onChange={(e) => {
                    const name = e.target.value;
                    const key = (document.getElementById('elevenlabs-key') as HTMLInputElement)?.value;
                    if (name && key) {
                      handleSaveAPIKey('ElevenLabs', key, name);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-key">API Key</Label>
                <Input
                  id="elevenlabs-key"
                  type="password"
                  placeholder="Enter ElevenLabs API key"
                  onChange={(e) => {
                    const key = e.target.value;
                    const name = (document.getElementById('elevenlabs-name') as HTMLInputElement)?.value;
                    if (name && key) {
                      handleSaveAPIKey('ElevenLabs', key, name);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voice-select">Default Voice</Label>
                <Select value={selectedVoice} onValueChange={onVoiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Get your API key from the{" "}
                <a
                  href="https://elevenlabs.io/subscription"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ElevenLabs dashboard
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whisper">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI Whisper API</CardTitle>
              <CardDescription>
                Configure OpenAI Whisper for voice-to-text capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whisper-name">Configuration Name</Label>
                <Input
                  id="whisper-name"
                  placeholder="Enter a memorable name (e.g. whisper_primary)"
                  onChange={(e) => {
                    const name = e.target.value;
                    const key = (document.getElementById('whisper-key') as HTMLInputElement)?.value;
                    if (name && key) {
                      handleSaveAPIKey('Whisper', key, name);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whisper-key">API Key</Label>
                <Input
                  id="whisper-key"
                  type="password"
                  placeholder="Enter OpenAI API key"
                  onChange={(e) => {
                    const key = e.target.value;
                    const name = (document.getElementById('whisper-name') as HTMLInputElement)?.value;
                    if (name && key) {
                      handleSaveAPIKey('Whisper', key, name);
                    }
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI dashboard
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
