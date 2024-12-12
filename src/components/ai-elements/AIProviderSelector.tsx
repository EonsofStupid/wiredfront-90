import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AIProvider } from "@/types/ai";

interface AIProviderSelectorProps {
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export const AIProviderSelector = ({ provider, onProviderChange }: AIProviderSelectorProps) => {
  return (
    <div className="mb-4">
      <Select value={provider} onValueChange={onProviderChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select AI Provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemini">Google Gemini</SelectItem>
          <SelectItem value="openai">OpenAI GPT-4</SelectItem>
          <SelectItem value="anthropic">Anthropic Claude</SelectItem>
          <SelectItem value="huggingface">Hugging Face</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};