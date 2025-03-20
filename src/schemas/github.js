import { z } from 'zod';
// GitHub Connection State Enum
export const githubConnectionStateSchema = z.enum([
    'idle',
    'connecting',
    'connected',
    'error'
]);
// GitHub Connection Schema
export const githubConnectionSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    account_username: z.string().nullable(),
    token: z.string().min(1, 'Token is required'),
    scopes: z.array(z.string()).default([]),
    created_at: z.string().datetime(),
    last_used: z.string().datetime().nullable(),
    is_valid: z.boolean().default(true),
    rate_limit: z.object({
        limit: z.number().int(),
        remaining: z.number().int(),
        reset: z.number().int()
    }).nullable()
});
// GitHub Auth Error Schema
export const githubAuthErrorSchema = z.object({
    message: z.string(),
    code: z.string().optional(),
    documentation_url: z.string().optional()
});
