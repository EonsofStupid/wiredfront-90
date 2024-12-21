import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AIServicesSettingsProps {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  alexaKey: string;
  cortanaKey: string;
  onOpenAIKeyChange: (value: string) => void;
  onHuggingfaceKeyChange: (value: string) => void;
  onGeminiKeyChange: (value: string) => void;
  onAlexaKeyChange: (value: string) => void;
  onCortanaKeyChange: (value: string) => void;
}

export function AIServicesSettings({
  openaiKey,
  huggingfaceKey,
  geminiKey,
  alexaKey,
  cortanaKey,
  onOpenAIKeyChange,
  onHuggingfaceKeyChange,
  onGeminiKeyChange,
  onAlexaKeyChange,
  onCortanaKeyChange,
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

        <AccordionItem value="alexa">
          <AccordionTrigger>Amazon Alexa API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Amazon Alexa API</CardTitle>
                <CardDescription>
                  Integrate voice commands and Alexa skills into your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alexa-key">API Key</Label>
                  <Input
                    id="alexa-key"
                    type="password"
                    value={alexaKey}
                    onChange={(e) => onAlexaKeyChange(e.target.value)}
                    placeholder="Enter Alexa API key"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your API key from the{" "}
                  <a
                    href="https://developer.amazon.com/alexa/console/ask"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Alexa Developer Console
                  </a>
                </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cortana">
          <AccordionTrigger>Microsoft Cortana API</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Cortana API</CardTitle>
                <CardDescription>
                  Integrate Microsoft's AI assistant capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cortana-key">API Key</Label>
                  <Input
                    id="cortana-key"
                    type="password"
                    value={cortanaKey}
                    onChange={(e) => onCortanaKeyChange(e.target.value)}
                    placeholder="Enter Cortana API key"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your API key from the{" "}
                  <a
                    href="https://www.microsoft.com/en-us/cortana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Microsoft Developer Portal
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