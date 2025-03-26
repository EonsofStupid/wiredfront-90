
/**
 * Safe JSON type that prevents excessive type instantiation depth
 * Use this type instead of Supabase's Json type in recursive structures
 */
export type SafeJson = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: SafeJson }
  | SafeJson[];

/**
 * Convert any type to a safe JSON representation
 * This is a type-level utility, not a runtime function
 */
export type AsSafeJson<T> = T extends string | number | boolean | null
  ? T
  : T extends Array<infer U>
  ? Array<AsSafeJson<U>>
  : T extends object
  ? { [K in keyof T]: AsSafeJson<T[K]> }
  : never;
