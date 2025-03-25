
/**
 * Generic JSON type definition
 * Used across the application to properly type JSON data
 */
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
