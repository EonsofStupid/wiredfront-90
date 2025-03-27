export type ChatProviderType = 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama';

export interface ChatProvider {
  id: string;
  name: string;
  type: ChatProviderType;
  isEnabled: boolean;
  isDefault: boolean;
  apiReference: string;
}
