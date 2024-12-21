import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AIServicesSettingsProps {
  openaiKey: string;
  huggingfaceKey: string;
  onOpenAIKeyChange: (value: string) => void;
  onHuggingfaceKeyChange: (value: string) => void;
}

export function AIServicesSettings({
  openaiKey,
  huggingfaceKey,
  onOpenAIKeyChange,
  onHuggingfaceKeyChange,
}: AIServicesSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API</CardTitle>
          <CardDescription>
            Configure OpenAI API for code generation, document processing, and AI assistants.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={openaiKey}
              onChange={(e) => onOpenAIKeyChange(e.target.value)}
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
          <CardTitle>Hugging Face API</CardTitle>
          <CardDescription>
            Access advanced NLP models and fine-tuned AI capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="huggingface-key">API Key</Label>
            <Input
              id="huggingface-key"
              type="password"
              value={huggingfaceKey}
              onChange={(e) => onHuggingfaceKeyChange(e.target.value)}
              placeholder="hf_..."
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Get your API key from the{" "}
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hugging Face settings
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}