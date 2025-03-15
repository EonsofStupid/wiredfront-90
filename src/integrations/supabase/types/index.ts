export type { Database, Json } from './database';
export type { Tables } from './tables';
export type { MessageType, SettingType } from './enums';
export * from './helpers';

// Add gallery_images to the list of tables in the database
declare module './database' {
  interface Database {
    public: {
      Tables: {
        gallery_images: {
          Row: {
            id: string;
            user_id: string;
            file_path: string;
            public_url: string | null;
            prompt: string | null;
            message_id: string | null;
            session_id: string | null;
            metadata: Json | null;
            created_at: string | null;
            updated_at: string | null;
          };
          Insert: {
            id?: string;
            user_id: string;
            file_path: string;
            public_url?: string | null;
            prompt?: string | null;
            message_id?: string | null;
            session_id?: string | null;
            metadata?: Json | null;
            created_at?: string | null;
            updated_at?: string | null;
          };
          Update: {
            id?: string;
            user_id?: string;
            file_path?: string;
            public_url?: string | null;
            prompt?: string | null;
            message_id?: string | null;
            session_id?: string | null;
            metadata?: Json | null;
            created_at?: string | null;
            updated_at?: string | null;
          };
        };
      };
    };
  }
}
