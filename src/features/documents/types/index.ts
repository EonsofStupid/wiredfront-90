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
  source_metadata: Record<string, any>;
  tags: string[];
  author: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
  file_type?: string;
  file_url?: string;
  error_message?: string;
  category_id?: string;
  import_status?: DocumentImportStatus;
  import_progress?: number;
  import_error?: string;
  source_type?: string;
  source_url?: string;
  retry_count?: number;
}

export type DocumentStatus = 
  | 'pending' 
  | 'processing' 
  | 'indexed'
  | 'completed' 
  | 'failed'
  | 'queued'
  | 'retrying'
  | 'canceled';

export type DocumentImportStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';