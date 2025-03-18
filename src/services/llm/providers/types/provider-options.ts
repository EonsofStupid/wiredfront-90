
import { BaseProviderOptions } from './common-types';

// Provider-specific options
export interface OpenAIProviderOptions extends BaseProviderOptions {
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
}

export interface AnthropicProviderOptions extends BaseProviderOptions {
  max_tokens_to_sample?: number;
  stop_sequences?: string[];
}

export interface GeminiProviderOptions extends BaseProviderOptions {
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface ReplicateProviderOptions extends BaseProviderOptions {
  width?: number;
  height?: number;
  num_outputs?: number;
}

export interface StabilityAIProviderOptions extends BaseProviderOptions {
  engine?: string;
  width?: number;
  height?: number;
  cfg_scale?: number;
  cfgScale?: number;
  steps?: number;
}

export type ProviderOptions = 
  | OpenAIProviderOptions 
  | AnthropicProviderOptions 
  | GeminiProviderOptions 
  | ReplicateProviderOptions 
  | StabilityAIProviderOptions;
