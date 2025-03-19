
/**
 * Type representing JSON data from the database
 */
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
