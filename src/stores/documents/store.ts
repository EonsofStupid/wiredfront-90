import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { DocumentStore } from './types';
import { toast } from 'sonner';

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
      let query = supabase
        .from('documents')
        .select('*, category:document_categories(*)');

      const { data, error } = await query;

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

  selectDocument: (document) => set({ selectedDocument: document }),
  setView: (view) => set({ view }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  clearFilters: () => set({
    filters: { category: null, type: null, search: '' }
  }),
}));