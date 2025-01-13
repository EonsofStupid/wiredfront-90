import { APIConfigurationItem } from "@/types/settings/api-configuration";

export const API_CONFIGURATIONS: APIConfigurationItem[] = [
  {
    type: 'openai',
    label: 'OpenAI',
    description: 'GPT models for advanced language tasks',
    docsUrl: "https://platform.openai.com/api-keys",
    docsText: "OpenAI dashboard",
    placeholder: "sk-..."
  },
  {
    type: 'anthropic',
    label: 'Anthropic Claude',
    description: 'Advanced reasoning and analysis',
    docsUrl: "https://console.anthropic.com/account/keys",
    docsText: "Anthropic Console",
    placeholder: "sk-ant-..."
  },
  {
    type: 'gemini',
    label: 'Google Gemini',
    description: 'Google\'s latest AI model',
    docsUrl: "https://makersuite.google.com/app/apikey",
    docsText: "Google AI Studio",
    placeholder: "Enter Gemini API key"
  },
  {
    type: 'huggingface',
    label: 'Hugging Face',
    description: 'Open-source AI models',
    docsUrl: "https://huggingface.co/settings/tokens",
    docsText: "Hugging Face settings",
    placeholder: "hf_..."
  },
  {
    type: 'stability',
    label: 'Stability AI',
    description: 'Advanced image generation and AI models',
    docsUrl: "https://platform.stability.ai/account/keys",
    docsText: "Stability AI dashboard",
    placeholder: "sk-..."
  },
  {
    type: 'replicate',
    label: 'Replicate',
    description: 'Run any ML model in the cloud',
    docsUrl: "https://replicate.com/account",
    docsText: "Replicate dashboard",
    placeholder: "r8_..."
  },
  {
    type: 'ai21',
    label: 'AI21 Labs',
    description: 'Advanced language models and APIs',
    docsUrl: "https://studio.ai21.com/account",
    docsText: "AI21 Labs dashboard",
    placeholder: "ai21-..."
  },
  {
    type: 'mosaic',
    label: 'MosaicML',
    description: 'Enterprise AI infrastructure and models',
    docsUrl: "https://console.mosaicml.com/settings/api-keys",
    docsText: "MosaicML Console",
    placeholder: "mk-..."
  },
  {
    type: 'databricks',
    label: 'Databricks',
    description: 'Enterprise AI and ML platform',
    docsUrl: "https://accounts.cloud.databricks.com/",
    docsText: "Databricks Console",
    placeholder: "dapi_..."
  },
  {
    type: 'azure',
    label: 'Microsoft Azure AI',
    description: 'Enterprise-grade AI services',
    docsUrl: "https://portal.azure.com/",
    docsText: "Azure Portal",
    placeholder: "Enter Azure API key"
  },
  {
    type: 'aws',
    label: 'AWS AI',
    description: 'Amazon Web Services AI/ML suite',
    docsUrl: "https://aws.amazon.com/console/",
    docsText: "AWS Console",
    placeholder: "Enter AWS API key"
  },
  {
    type: 'watson',
    label: 'IBM Watson',
    description: 'Enterprise AI solutions',
    docsUrl: "https://cloud.ibm.com/",
    docsText: "IBM Cloud Console",
    placeholder: "Enter Watson API key"
  },
  {
    type: 'forefront',
    label: 'Forefront AI',
    description: 'Advanced AI models and APIs',
    docsUrl: "https://forefront.ai/dashboard",
    docsText: "Forefront Dashboard",
    placeholder: "ff-..."
  }
];