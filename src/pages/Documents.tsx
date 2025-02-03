import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  content: string;
  status: string;
  file_type?: string;
  file_url?: string;
  created_at: string;
  error_message?: string;
}

const Documents = () => {
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Document[];
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          content: '',
          file_type: fileExt,
          file_url: uploadData.path,
          status: 'processing'
        });

      if (insertError) throw insertError;

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="text-red-500">Error loading documents</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Documents</h1>
          </div>
          <Button onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        {isLoading ? (
          <div className="text-center p-8">Loading documents...</div>
        ) : !documents?.length ? (
          <div className="text-center p-8 text-muted-foreground">
            No documents found. Upload some documents to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Status: {doc.status}
                  </p>
                  {doc.error_message && (
                    <p className="text-sm text-destructive mt-2">
                      Error: {doc.error_message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Documents;