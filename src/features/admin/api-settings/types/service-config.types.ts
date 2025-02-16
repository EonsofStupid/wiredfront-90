
import { APIType } from "./api-config.types";

export interface ServiceProviderConfig {
  type: APIType;
  label: string;
  description: string;
  category: 'ai' | 'vector' | 'voice' | 'storage' | 'development';
  docsUrl: string;
  configurationOptions?: {
    requiresEndpoint?: boolean;
    requiresGRPC?: boolean;
    supportsNamespaces?: boolean;
    hasCustomSettings?: boolean;
  };
  metadata?: {
    costPerRequest?: number;
    rateLimit?: number;
    supportedFeatures?: string[];
  };
}

export interface ServiceMetrics {
  totalRequests: number;
  totalCost: number;
  averageLatency?: number;
  errorRate?: number;
  lastUsed?: string;
}
