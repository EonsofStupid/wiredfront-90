import { Database } from "@/integrations/supabase/types";

export interface APISettingsState {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  elevenLabsKey: string;
  selectedVoice: string;
  googleDriveKey: string;
  dropboxKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  githubToken: string;
  dockerToken: string;
}

export type APIType = Database["public"]["Enums"]["api_type"];
export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];