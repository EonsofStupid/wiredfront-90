export type Json =
  | string
  | number
  | boolean
  | null
  | { key?: string; [key: string]: Json | undefined }
  | Json[]