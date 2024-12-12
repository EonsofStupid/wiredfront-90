import { Bot, Brain, Sparkles, Cpu, Network, Workflow } from "lucide-react";
import type { AIProviderConfig } from "@/types/ai";

export const AI_PROVIDERS: Record<string, AIProviderConfig> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's most capable AI model for text, code, and multimodal tasks",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["gemini-pro", "gemini-pro-vision"],
    icon: Bot
  },
  chatgpt: {
    id: "chatgpt",
    name: "OpenAI GPT-4",
    description: "Advanced language model for natural conversations and complex tasks",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["gpt-4o-mini", "gpt-4o"],
    icon: Brain
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Specialized in thoughtful analysis and detailed responses",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["claude-3-opus-20240229"],
    icon: Sparkles
  },
  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    description: "Open-source AI models for various specialized tasks",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["mistralai/Mixtral-8x7B-Instruct-v0.1"],
    icon: Network
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    description: "Efficient and powerful language models",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["mistral-medium", "mistral-small"],
    icon: Cpu
  },
  cohere: {
    id: "cohere",
    name: "Cohere",
    description: "Specialized in enterprise-grade language AI",
    isEnabled: false,
    apiKeyRequired: true,
    models: ["command", "command-light"],
    icon: Workflow
  }
};

export const DEFAULT_PROVIDER = "gemini";
export const DEFAULT_MODEL = "gemini-pro";