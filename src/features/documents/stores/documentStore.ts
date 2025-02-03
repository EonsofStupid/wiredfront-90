import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { DocumentStore } from '../types';
import { toast } from 'sonner';

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  loading: false,
  error: null,
  view: 'grid',
  filters: {
    search: '',
  },

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*');

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
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
}));