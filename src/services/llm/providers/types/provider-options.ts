
import { BaseProviderOptions } from './common-types';

// Provider-specific options
export interface OpenAIProviderOptions extends BaseProviderOptions {
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface AnthropicProviderOptions extends BaseProviderOptions {
  max_tokens_to_sample?: number;
  stop_sequences?: string[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export interface GeminiProviderOptions extends BaseProviderOptions {
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  temperature?: number;
  stopSequences?: string[];
}

export interface ReplicateProviderOptions extends BaseProviderOptions {
  width?: number;
  height?: number;
  num_outputs?: number;
  scheduler?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  prompt_strength?: number;
  refine?: string;
}

export interface StabilityAIProviderOptions extends BaseProviderOptions {
  engine?: string;
  width?: number;
  height?: number;
  cfg_scale?: number;
  samples?: number;
  steps?: number;
  seed?: number;
  style_preset?: string;
}

export type ProviderOptions = 
  | OpenAIProviderOptions 
  | AnthropicProviderOptions 
  | GeminiProviderOptions 
  | ReplicateProviderOptions 
  | StabilityAIProviderOptions;
