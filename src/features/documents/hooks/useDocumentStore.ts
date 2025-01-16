import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { processDocument } from '../core/documentProcessor';
import { toast } from 'sonner';

interface DocumentState {
  documents: any[];
  loading: boolean;
  error: string | null;
  selectedDocument: any | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  processDocument: (documentId: string) => Promise<void>;
  setSelectedDocument: (document: any) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: false,
  error: null,
  selectedDocument: null,

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

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

  uploadDocument: async (file: File) => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No authenticated user');

      // Upload file to storage
      const filename = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_type: file.type,
          file_url: filename,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Process the document
      await processDocument(data.id);
      
      await get().fetchDocuments();
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      set({ loading: false });
    }
  },

  processDocument: async (documentId: string) => {
    try {
      await processDocument(documentId);
      await get().fetchDocuments();
    } catch (error) {
      console.error('Error processing document:', error);
    }
  },

  setSelectedDocument: (document) => {
    set({ selectedDocument: document });
  },
}));