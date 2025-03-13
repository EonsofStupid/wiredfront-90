
export interface UserPreferences {
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  username: string;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'realtime';
  types: string[];
  marketing: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  tls: boolean;
  database: number;
}

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  redis: RedisConfig;
}

// Update to match the Zod schema - all properties are optional
export interface APISettingsState {
  openaiKey?: string;
  huggingfaceKey?: string;
  geminiKey?: string;
  anthropicKey?: string;
  perplexityKey?: string;
  elevenLabsKey?: string;
  selectedVoice?: string;
  googleDriveKey?: string;
  dropboxKey?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  githubToken?: string;
  dockerToken?: string;
}
