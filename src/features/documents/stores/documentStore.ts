import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Document } from '../types';

interface DocumentState {
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

interface DocumentActions {
  fetchDocuments: () => Promise<void>;
  selectDocument: (document: Document | null) => void;
  setView: (view: DocumentState['view']) => void;
  setSortBy: (sortBy: DocumentState['sortBy']) => void;
  setSortOrder: (order: DocumentState['sortOrder']) => void;
  setFilters: (filters: Partial<DocumentState['filters']>) => void;
  clearFilters: () => void;
}

type DocumentStore = DocumentState & DocumentActions;

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
  view: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
  filters: {
    category: null,
    type: null,
    search: '',
  },

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*, category:document_categories(*)');

      if (error) throw error;

      // Transform the data to ensure type safety
      const transformedDocuments = (data || []).map(doc => ({
        ...doc,
        metadata: {
          author: doc.metadata?.author || '',
          created_by: doc.metadata?.created_by || '',
          last_modified_by: doc.metadata?.last_modified_by || '',
          version: doc.metadata?.version || '',
          custom_fields: doc.metadata?.custom_fields || {},
        },
        source_metadata: doc.source_metadata || {},
        tags: doc.tags || [],
        retry_count: doc.retry_count || 0,
      }));

      set({ documents: transformedDocuments });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ error: error.message });
      toast.error('Failed to fetch documents');
    } finally {
      set({ loading: false });
    }
  },

  selectDocument: (document) => set({ selectedDocument: document }),
  setView: (view) => set({ view }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  clearFilters: () => set({
    filters: { category: null, type: null, search: '' }
  }),
}));