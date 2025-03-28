import { z } from "zod";

export const ChatSettingsSchema = z.object({
  defaultModel: z.string(),
  systemPrompt: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  streamingEnabled: z.boolean(),

  saveHistory: z.boolean(),
  anonymizeData: z.boolean(),
  dataRetentionDays: z.number().min(0),
  allowAnalytics: z.boolean(),

  darkMode: z.boolean(),
  fontSize: z.enum(["small", "medium", "large"]),
  messageAlignment: z.enum(["left", "center", "right"]),
  showTimestamps: z.boolean(),

  debugMode: z.boolean(),
  experimentalFeatures: z.boolean(),
  apiTimeout: z.number().min(1),
  retryAttempts: z.number().min(0),

  soundEnabled: z.boolean(),
  desktopNotifications: z.boolean(),
  mentionAlerts: z.boolean(),
  emailDigest: z.boolean()
});

export type ChatSettingsType = z.infer<typeof ChatSettingsSchema>;
