import { z } from "zod";

// Enum extracted from app_role in Supabase
export enum AppRole {
  user = "user",
  admin = "admin",
  super_admin = "super_admin",
}

export const UserRoleSchema = z.nativeEnum(AppRole);

export const UserRoleRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserRoleRecord = z.infer<typeof UserRoleRecordSchema>;
