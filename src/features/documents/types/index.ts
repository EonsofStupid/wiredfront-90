import { Database } from '@/integrations/supabase/types';

export type Document = Database['public']['Tables']['documents']['Row'];

export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  view: 'grid' | 'list';
  filters: {
    search: string;
  };
}

export interface DocumentActions {
  fetchDocuments: () => Promise<void>;
  setView: (view: DocumentState['view']) => void;
  setFilters: (filters: Partial<DocumentState['filters']>) => void;
}

export type DocumentStore = DocumentState & DocumentActions;