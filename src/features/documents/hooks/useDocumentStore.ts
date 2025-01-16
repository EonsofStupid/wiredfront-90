import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  file_url?: string;
  status: "pending" | "processing" | "indexed" | "failed";
}

interface DocumentStore {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ documents: data || [] });
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to fetch documents");
    } finally {
      set({ isLoading: false });
    }
  },

  uploadDocument: async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("documents").insert({
        title: file.name,
        content: "", // Initialize with empty content
        file_type: file.type,
        file_url: filePath,
        status: "pending",
        metadata: { originalName: file.name }
      });

      if (insertError) throw insertError;
    } catch (error) {
      toast.error("Failed to upload document");
      throw error;
    }
  },

  deleteDocument: async (id: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
      }));
    } catch (error) {
      toast.error("Failed to delete document");
      throw error;
    }
  },
}));