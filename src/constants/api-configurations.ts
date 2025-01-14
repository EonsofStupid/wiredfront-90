import { APIConfigurationItem } from "@/types/settings/api-configuration";
import { APIType } from "@/types/store/settings/api-config";

export const API_CONFIGURATIONS: APIConfigurationItem[] = [
  {
    type: 'openai' as APIType,
    label: 'OpenAI',
    description: 'GPT models for advanced language tasks',
    docsUrl: "https://platform.openai.com/api-keys",
    docsText: "OpenAI dashboard",
    placeholder: "sk-..."
  },
  {
    type: 'anthropic' as APIType,
    label: 'Anthropic Claude',
    description: 'Advanced reasoning and analysis',
    docsUrl: "https://console.anthropic.com/account/keys",
    docsText: "Anthropic Console",
    placeholder: "sk-ant-..."
  },
  {
    type: 'gemini' as APIType,
    label: 'Google Gemini',
    description: 'Google\'s latest AI model',
    docsUrl: "https://makersuite.google.com/app/apikey",
    docsText: "Google AI Studio",
    placeholder: "Enter Gemini API key"
  },
  {
    type: 'huggingface' as APIType,
    label: 'Hugging Face',
    description: 'Open-source AI models',
    docsUrl: "https://huggingface.co/settings/tokens",
    docsText: "Hugging Face settings",
    placeholder: "hf_..."
  }
];