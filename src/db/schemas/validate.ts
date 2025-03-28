
import { ZodTypeAny, z } from "zod";

export function validateRecord<T extends ZodTypeAny>(
  schema: T,
  input: unknown,
  logPrefix = "DB Record"
): z.infer<T> | null {
  const result = schema.safeParse(input);
  if (!result.success) {
    console.warn(`[${logPrefix}] Validation failed:`, result.error.format());
    return null;
  }
  return result.data;
}
