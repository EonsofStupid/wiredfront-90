export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type DocumentImportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  metadata?: Record<string, any>;
  status: DocumentStatus;
  created_at?: string;
  updated_at?: string;
  file_type?: string;
  file_url?: string;
  error_message?: string;
  category_id?: string;
  import_status?: DocumentImportStatus;
  import_progress?: number;
  import_error?: string;
  source_type?: string;
  source_url?: string;
  source_metadata?: Record<string, any>;
}