
import { z } from 'zod';

// API Type Enum
export const apiTypeSchema = z.enum([
  'openai', 
  'anthropic', 
  'gemini', 
  'huggingface', 
  'pinecone',
  'github',
  'docker',
  'elevenLabs'
]);

// Validation Status Type Enum
export const validationStatusSchema = z.enum([
  'pending',
  'valid',
  'invalid',
  'expired'
]);

// API Settings State Schema
export const apiSettingsStateSchema = z.object({
  openaiKey: z.string(),
  huggingfaceKey: z.string(),
  geminiKey: z.string(),
  anthropicKey: z.string(),
  perplexityKey: z.string(),
  elevenLabsKey: z.string(),
  selectedVoice: z.string(),
  googleDriveKey: z.string(),
  dropboxKey: z.string(),
  awsAccessKey: z.string(),
  awsSecretKey: z.string(),
  githubToken: z.string(),
  dockerToken: z.string()
}).partial();

// API Configuration Schema
export const apiConfigurationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  api_type: apiTypeSchema,
  memorable_name: z.string().optional(),
  is_enabled: z.boolean().default(true),
  is_default: z.boolean().default(false),
  validation_status: validationStatusSchema.default('pending'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  feature_bindings: z.array(z.string()).optional(),
  last_validated: z.string().datetime().optional(),
  provider_settings: z.record(z.any()).optional(),
  usage_metrics: z.record(z.any()).optional(),
  rag_preference: z.string().optional(),
  planning_mode: z.string().optional()
});

// New Config State Schema for API Key Wizard
export const newConfigStateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  key: z.string().min(1, 'Key is required'),
  assistantId: z.string().optional(),
  endpoint_url: z.string().optional(),
  grpc_endpoint: z.string().optional(),
  read_only_key: z.string().optional(),
  environment: z.string().optional(),
  index_name: z.string().optional()
});

// Derive TypeScript types from Zod schemas
export type APIType = z.infer<typeof apiTypeSchema>;
export type ValidationStatusType = z.infer<typeof validationStatusSchema>;
export type APISettingsState = z.infer<typeof apiSettingsStateSchema>;
export type APIConfiguration = z.infer<typeof apiConfigurationSchema>;
export type NewConfigState = z.infer<typeof newConfigStateSchema>;
