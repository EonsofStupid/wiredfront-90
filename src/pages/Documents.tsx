import React, { useEffect } from "react";
import { FileText, Upload } from "lucide-react";
import { DocumentList } from "@/features/documents/ui/DocumentList";
import { useDocumentStore } from "@/features/documents/hooks/useDocumentStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Documents = () => {
  const { fetchDocuments, uploadDocument } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocument(file);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Documents</h1>
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload Document
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".txt,.pdf,.doc,.docx"
          />
        </Button>
      </div>
      
      <div className="rounded-lg border bg-card">
        <DocumentList />
      </div>
    </div>
  );
};

export default Documents;