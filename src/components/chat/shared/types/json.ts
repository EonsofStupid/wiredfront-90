
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
 * Convert any type to a safe JSON representation with limited recursion depth
 * This is a type-level utility, not a runtime function
 */
export type AsSafeJson<T, Depth extends number = 3> = 
  Depth extends 0 ? string | number | boolean | null :
  T extends string | number | boolean | null ? T :
  T extends Array<infer U> ? AsSafeJson<U, DecDepth<Depth>>[] :
  T extends object ? { [K in keyof T]: AsSafeJson<T[K], DecDepth<Depth>> } :
  string | number | boolean | null;

// Helper type to decrement depth counter
type DecDepth<D extends number> = D extends 0 ? 0 : D extends 1 ? 0 : D extends 2 ? 1 : D extends 3 ? 2 : D extends 4 ? 3 : 0;
