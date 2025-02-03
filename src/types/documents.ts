export type DocumentStatus = 
  | 'pending' 
  | 'processing' 
  | 'indexed'
  | 'completed' 
  | 'failed'
  | 'queued'
  | 'retrying'
  | 'canceled';

export interface Document {
  id: string;
  title: string;
  content: string;
  status: DocumentStatus;
  metadata: {
    author: string;
    created_by: string;
    last_modified_by: string;
    version: string;
    custom_fields: Record<string, unknown>;
  };
  source_metadata: any; // Changed to match database schema
  tags: string[];
  author: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
}