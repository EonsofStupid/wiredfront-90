import { BaseProviderOptions, ProviderContext, ProviderDocument } from '../base/types';

export type GeminiModelType = 'gemini-pro' | 'gemini-pro-vision';

export interface GeminiModel {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface GeminiSafetySetting {
  category: 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 'HARM_CATEGORY_DANGEROUS_CONTENT';
  threshold: 'BLOCK_NONE' | 'BLOCK_LOW' | 'BLOCK_MEDIUM' | 'BLOCK_HIGH';
}

export interface GeminiOptions extends BaseProviderOptions {
  model?: GeminiModelType;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  safetySettings?: GeminiSafetySetting[];
  stream?: boolean;
}

export interface GeminiContext extends ProviderContext {
  system?: string;
  documents?: ProviderDocument[];
}

export interface GeminiImageOptions extends GeminiOptions {
  quality?: 'standard' | 'high';
  maxOutputTokens?: number;
}

export interface GeminiImageResponse {
  text: string;
  metadata: {
    model: string;
    quality: string;
    url: string;
    latency: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
} 