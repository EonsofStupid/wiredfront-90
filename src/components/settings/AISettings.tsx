import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface AISettingsData {
  provider: string;
  api_key: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  is_active: boolean;
}

export function AISettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettingsData>({
    provider: 'gemini',
    api_key: '',
    model_name: '',
    max_tokens: 1000,
    temperature: 0.7,
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load AI settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">AI Provider Settings</h2>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="provider">AI Provider</Label>
          <Select
            value={settings.provider}
            onValueChange={(value) => setSettings({ ...settings, provider: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="huggingface">Hugging Face</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="mistral">Mistral</SelectItem>
              <SelectItem value="cohere">Cohere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="api_key">API Key</Label>
          <Input
            id="api_key"
            type="password"
            value={settings.api_key || ''}
            onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="model_name">Model Name</Label>
          <Input
            id="model_name"
            value={settings.model_name || ''}
            onChange={(e) => setSettings({ ...settings, model_name: e.target.value })}
          />
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

        <Button onClick={saveSettings} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
}