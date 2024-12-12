import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface AISettingsData {
  provider: string;
  api_key: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  is_active: boolean;
  user_id: string;
}

export function AISettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettingsData>({
    provider: 'gemini',
    api_key: '',
    model_name: '',
    max_tokens: 1000,
    temperature: 0.7,
    is_active: true,
    user_id: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');
        setSettings(prev => ({ ...prev, user_id: user.id }));
        
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error initializing settings:', error);
        toast({
          title: "Error loading settings",
          description: "Failed to load AI settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, [toast]);

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('ai_settings')
        .upsert(settings, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your AI settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save AI settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">AI Provider Settings</h2>
      
      <Tabs defaultValue="text" className="w-full">
        <TabsList>
          <TabsTrigger value="text">Text Generation</TabsTrigger>
          <TabsTrigger value="chat">Chat Models</TabsTrigger>
          <TabsTrigger value="image">Image Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label>Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(value) => setSettings({ ...settings, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Model</Label>
              <Input
                value={settings.model_name}
                onChange={(e) => setSettings({ ...settings, model_name: e.target.value })}
              />
            </div>

            <Button onClick={saveSettings}>Save Text Generation Settings</Button>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label>Chat Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(value) => setSettings({ ...settings, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Temperature ({settings.temperature})</Label>
              <Slider
                value={[settings.temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={settings.max_tokens}
                onChange={(e) => setSettings({ ...settings, max_tokens: parseInt(e.target.value) })}
              />
            </div>

            <Button onClick={saveSettings}>Save Chat Settings</Button>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label>Image Generation Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(value) => setSettings({ ...settings, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">DALL-E 3</SelectItem>
                  <SelectItem value="gemini">Gemini Vision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Image Size</Label>
              <Select defaultValue="1024x1024">
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="256x256">256x256</SelectItem>
                  <SelectItem value="512x512">512x512</SelectItem>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={saveSettings}>Save Image Generation Settings</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}