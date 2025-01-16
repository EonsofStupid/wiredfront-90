import React, { useEffect } from "react";
import { useDocumentStore } from "@/features/documents/hooks/useDocumentStore";
import { DocumentList } from "@/features/documents/ui/DocumentList";
import { DocumentUpload } from "@/features/documents/ui/DocumentUpload";

export const DocumentsPage = () => {
  const { fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <DocumentUpload />
      </div>
      <DocumentList />
    </div>
  );
};