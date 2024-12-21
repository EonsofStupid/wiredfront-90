import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AIServicesSettingsProps {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  onOpenAIKeyChange: (value: string) => void;
  onHuggingfaceKeyChange: (value: string) => void;
  onGeminiKeyChange: (value: string) => void;
  onAnthropicKeyChange: (value: string) => void;
  onPerplexityKeyChange: (value: string) => void;
}

export function AIServicesSettings({
  openaiKey,
  huggingfaceKey,
  geminiKey,
  anthropicKey,
  perplexityKey,
  onOpenAIKeyChange,
  onHuggingfaceKeyChange,
  onGeminiKeyChange,
  onAnthropicKeyChange,
  onPerplexityKeyChange,
}: AIServicesSettingsProps) {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="openai">
          <AccordionTrigger>OpenAI API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>OpenAI API</CardTitle>
                <CardDescription>
                  Configure OpenAI API for GPT models and DALL-E image generation.
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="anthropic">
          <AccordionTrigger>Anthropic API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Anthropic API</CardTitle>
                <CardDescription>
                  Configure Anthropic API for Claude models.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">API Key</Label>
                  <Input
                    id="anthropic-key"
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => onAnthropicKeyChange(e.target.value)}
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
                    Anthropic Console
                  </a>
                </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="perplexity">
          <AccordionTrigger>Perplexity API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Perplexity API</CardTitle>
                <CardDescription>
                  Configure Perplexity API for advanced language models.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="perplexity-key">API Key</Label>
                  <Input
                    id="perplexity-key"
                    type="password"
                    value={perplexityKey}
                    onChange={(e) => onPerplexityKeyChange(e.target.value)}
                    placeholder="pplx-..."
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your API key from the{" "}
                  <a
                    href="https://www.perplexity.ai/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Perplexity Settings
                  </a>
                </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="huggingface">
          <AccordionTrigger>Hugging Face API</AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gemini">
          <AccordionTrigger>Google Gemini API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Google Gemini API</CardTitle>
                <CardDescription>
                  Leverage Google's latest AI model for advanced language tasks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">API Key</Label>
                  <Input
                    id="gemini-key"
                    type="password"
                    value={geminiKey}
                    onChange={(e) => onGeminiKeyChange(e.target.value)}
                    placeholder="Enter Gemini API key"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your API key from the{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}