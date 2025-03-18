import { BaseProviderOptions, ProviderContext, ProviderResponse } from '../base/types';

export interface OpenAIModel {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface OpenAIOptions extends BaseProviderOptions {
  model: string;
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

export interface OpenAIImageOptions extends OpenAIOptions {
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
  n?: number;
}

export interface OpenAIImageResponse extends ProviderResponse {
  metadata: {
    model: string;
    size: string;
    quality: string;
    style: string;
    n: number;
    url: string;
  };
} 