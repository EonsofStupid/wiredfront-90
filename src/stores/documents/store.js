import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export const useDocumentStore = create((set, get) => ({
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
            if (error)
                throw error;
            // Transform the data to ensure type safety
            const transformedDocuments = (data || []).map(doc => ({
                ...doc,
                status: doc.status, // Ensure status is properly typed
                metadata: {
                    ...(doc.metadata || {}),
                    author: (doc.metadata || {}).author,
                    created_by: (doc.metadata || {}).created_by,
                    last_modified_by: (doc.metadata || {}).last_modified_by,
                    version: (doc.metadata || {}).version,
                    custom_fields: (doc.metadata || {}).custom_fields,
                },
                source_metadata: doc.source_metadata,
                tags: doc.tags || [],
            })); // Explicitly type as Document array
            set({ documents: transformedDocuments });
        }
        catch (error) {
            console.error('Error fetching documents:', error);
            set({ error: error.message });
            toast.error('Failed to fetch documents');
        }
        finally {
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
