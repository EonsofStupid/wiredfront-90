import { Document } from '@/types/documents';

export interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
  view: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  filters: {
    category: string | null;
    type: string | null;
    search: string;
  };
}

export interface DocumentActions {
  fetchDocuments: () => Promise<void>;
  selectDocument: (document: Document | null) => void;
  setView: (view: DocumentState['view']) => void;
  setSortBy: (sortBy: DocumentState['sortBy']) => void;
  setSortOrder: (order: DocumentState['sortOrder']) => void;
  setFilters: (filters: Partial<DocumentState['filters']>) => void;
  clearFilters: () => void;
}

export type DocumentStore = DocumentState & DocumentActions;