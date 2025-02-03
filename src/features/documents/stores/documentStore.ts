import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Document } from '@/types/documents';

interface DocumentState {
  documents: Document[];
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
  setView: (view: DocumentState['view']) => void;
  setSortBy: (sortBy: DocumentState['sortBy']) => void;
  setSortOrder: (order: DocumentState['sortOrder']) => void;
  setFilters: (filters: Partial<DocumentState['filters']>) => void;
  clearFilters: () => void;
}

export const useDocumentStore = create<DocumentState & DocumentActions>((set, get) => ({
  documents: [],
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

      set({ documents: data || [] });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ error: error.message });
      toast.error('Failed to fetch documents');
    } finally {
      set({ loading: false });
    }
  },

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