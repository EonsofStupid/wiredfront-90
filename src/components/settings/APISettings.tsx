import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function APISettings() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error: openaiError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          setting_id: 'openai-api-key',
          value: { key: openaiKey }
        });

      const { error: anthropicError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          setting_id: 'anthropic-api-key',
          value: { key: anthropicKey }
        });

      if (openaiError || anthropicError) throw new Error('Failed to save API keys');

      toast({
        title: "Success",
        description: "API keys have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to save API keys. Please try again.",
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
          Configure your API keys for various services.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>OpenAI API</CardTitle>
            <CardDescription>
              Configure your OpenAI API key for AI chat functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
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

        <Card>
          <CardHeader>
            <CardTitle>Anthropic API</CardTitle>
            <CardDescription>
              Configure your Anthropic API key for Claude integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anthropic-key">API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Get your API key from the{" "}
              <a
                href="https://console.anthropic.com/account/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Anthropic console
              </a>
            </p>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto"
        >
          {isSaving ? "Saving..." : "Save API Keys"}
        </Button>
      </div>
    </div>
  );
}