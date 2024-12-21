import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AIServicesSection } from "./AIServicesSection";

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
  const services = [
    {
      id: "openai",
      title: "OpenAI API",
      description: "Configure OpenAI API for GPT models and DALL-E image generation.",
      apiKey: openaiKey,
      onApiKeyChange: onOpenAIKeyChange,
      placeholder: "sk-...",
      docsUrl: "https://platform.openai.com/api-keys",
      docsText: "OpenAI dashboard",
    },
    {
      id: "anthropic",
      title: "Anthropic API",
      description: "Configure Anthropic API for Claude models.",
      apiKey: anthropicKey,
      onApiKeyChange: onAnthropicKeyChange,
      placeholder: "sk-ant-...",
      docsUrl: "https://console.anthropic.com/account/keys",
      docsText: "Anthropic Console",
    },
    {
      id: "perplexity",
      title: "Perplexity API",
      description: "Configure Perplexity API for advanced language models.",
      apiKey: perplexityKey,
      onApiKeyChange: onPerplexityKeyChange,
      placeholder: "pplx-...",
      docsUrl: "https://www.perplexity.ai/settings",
      docsText: "Perplexity Settings",
    },
    {
      id: "huggingface",
      title: "Hugging Face API",
      description: "Access advanced NLP models and fine-tuned AI capabilities.",
      apiKey: huggingfaceKey,
      onApiKeyChange: onHuggingfaceKeyChange,
      placeholder: "hf_...",
      docsUrl: "https://huggingface.co/settings/tokens",
      docsText: "Hugging Face settings",
    },
    {
      id: "gemini",
      title: "Google Gemini API",
      description: "Leverage Google's latest AI model for advanced language tasks.",
      apiKey: geminiKey,
      onApiKeyChange: onGeminiKeyChange,
      placeholder: "Enter Gemini API key",
      docsUrl: "https://makersuite.google.com/app/apikey",
      docsText: "Google AI Studio",
    },
  ];

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {services.map((service) => (
          <AccordionItem key={service.id} value={service.id}>
            <AccordionTrigger>{service.title}</AccordionTrigger>
            <AccordionContent>
              <AIServicesSection {...service} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}