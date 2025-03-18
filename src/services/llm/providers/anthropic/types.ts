import { BaseProviderOptions, ProviderContext, ProviderResponse } from '../base/types';

export type AnthropicModelType = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';

export interface AnthropicModel {
  id: AnthropicModelType;
  name: string;
  contextWindow: number;
  maxTokens: number;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface AnthropicOptions extends BaseProviderOptions {
  model: AnthropicModelType;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  stream?: boolean;
}

export interface AnthropicContext extends ProviderContext {
  system?: string;
  stopSequences?: string[];
}

export interface AnthropicImageOptions extends Omit<AnthropicOptions, 'model'> {
  model?: AnthropicModelType;
  maxTokens?: number;
  quality?: 'standard' | 'hd';
}

export interface AnthropicImageResponse extends ProviderResponse {
  metadata: {
    model: AnthropicModelType;
    quality: string;
    url: string;
    latency: number;
  };
} 