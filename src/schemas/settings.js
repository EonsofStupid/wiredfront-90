import { z } from 'zod';
// Redis Configuration Schema
export const redisConfigSchema = z.object({
    host: z.string().min(1, 'Host is required'),
    port: z.number().int().min(1, 'Port must be a positive integer'),
    tls: z.boolean().default(true),
    database: z.number().int().min(0, 'Database must be a non-negative integer')
});
// Cache Settings Schema
export const cacheSettingsSchema = z.object({
    enabled: z.boolean().default(true),
    ttl: z.number().int().min(1, 'TTL must be a positive integer'),
    maxSize: z.number().int().min(1, 'Max size must be a positive integer'),
    redis: redisConfigSchema
});
// User Preferences Schema
export const userPreferencesSchema = z.object({
    defaultView: z.string().default('dashboard'),
    refreshInterval: z.number().int().min(30, 'Refresh interval must be at least 30 seconds').default(60),
    notifications: z.boolean().default(true),
    timezone: z.string().default('UTC'),
    highContrast: z.boolean().default(false),
    reduceMotion: z.boolean().default(false),
    largeText: z.boolean().default(false),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    language: z.string().default('en'),
});
// Notification Settings Schema
export const notificationSettingsSchema = z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    frequency: z.enum(['daily', 'weekly', 'realtime']).default('realtime'),
    types: z.array(z.string()).default([]),
    marketing: z.boolean().default(false)
});
// Dashboard Layout Schema
export const dashboardLayoutSchema = z.object({
    widgets: z.array(z.object({
        id: z.string(),
        type: z.string(),
        position: z.object({
            x: z.number().int(),
            y: z.number().int(),
            w: z.number().int().min(1),
            h: z.number().int().min(1)
        })
    })).default([])
});
// Complete Settings Schema
export const settingsSchema = z.object({
    preferences: userPreferencesSchema,
    dashboardLayout: dashboardLayoutSchema,
    notifications: notificationSettingsSchema,
    cache: cacheSettingsSchema
});
