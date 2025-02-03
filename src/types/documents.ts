export type DocumentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed'
  | 'queued'
  | 'retrying'
  | 'canceled'
  | 'indexed';

export type DocumentImportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string | null;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  metadata?: {
    author?: string;
    created_by?: string;
    last_modified_by?: string;
    version?: string;
    custom_fields?: Record<string, unknown>;
    [key: string]: unknown;
  };
  status: DocumentStatus;
  created_at?: string;
  updated_at?: string;
  file_type?: string;
  file_url?: string;
  error_message?: string;
  category?: DocumentCategory;
  category_id?: string;
  import_status?: DocumentImportStatus;
  import_progress?: number;
  import_error?: string;
  source_type?: string;
  source_url?: string;
  source_metadata?: Record<string, any>;
  retry_count: number;
  tags: string[];
  author?: string;
}