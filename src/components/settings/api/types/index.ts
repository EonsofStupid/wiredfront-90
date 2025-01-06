import { APIType } from "@/types/store/settings/api-config";

export interface MessageMetadata {
  status?: 'connecting' | 'connected' | 'error';
  configId?: string;
  provider?: string;
  error?: string;
}

export interface ServiceConfig {
  type: APIType;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface NewConfigState {
  name: string;
  key: string;
  assistantId?: string;
}