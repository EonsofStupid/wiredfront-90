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
      const { data, error } = await supabase
        .from('documents')
        .select('*, category:document_categories(*)');

      if (error) throw error;

      // Transform the data to ensure type safety
      const transformedDocuments = (data || []).map(doc => ({
        ...doc,
        metadata: {
          ...((doc.metadata as Record<string, unknown>) || {}),
          author: ((doc.metadata as Record<string, unknown>) || {}).author as string,
          created_by: ((doc.metadata as Record<string, unknown>) || {}).created_by as string,
          last_modified_by: ((doc.metadata as Record<string, unknown>) || {}).last_modified_by as string,
          version: ((doc.metadata as Record<string, unknown>) || {}).version as string,
          custom_fields: ((doc.metadata as Record<string, unknown>) || {}).custom_fields as Record<string, unknown>,
        },
        source_metadata: doc.source_metadata as Record<string, unknown> | null,
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