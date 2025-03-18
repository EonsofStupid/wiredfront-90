import { BaseProviderOptions, ProviderContext, ProviderResponse } from '../base/types';

export type OpenAIModelType = 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo' | 'dall-e-3' | 'dall-e-2';

export interface OpenAIModel {
  id: OpenAIModelType;
  name: string;
  contextWindow: number;
  maxTokens: number;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface OpenAIOptions extends BaseProviderOptions {
  model: OpenAIModelType;
  presencePenalty?: number;
  frequencyPenalty?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
  functions?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
  functionCall?: 'none' | 'auto' | { name: string };
}

export interface OpenAIContext extends ProviderContext {
  system?: string;
  functions?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
  functionCall?: 'none' | 'auto' | { name: string };
}

export interface OpenAIImageOptions extends Omit<OpenAIOptions, 'model'> {
  model?: 'dall-e-3' | 'dall-e-2';
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
  n?: number;
}

export interface OpenAIImageResponse extends ProviderResponse {
  metadata: {
    model: 'dall-e-3' | 'dall-e-2';
    size: string;
    quality: string;
    style: string;
    n: number;
    url: string;
  };
} 