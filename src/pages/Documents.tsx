import React, { useEffect } from "react";
import { FileText } from "lucide-react";
import { DocumentList } from "@/features/documents/ui/DocumentList";
import { DocumentUpload } from "@/features/documents/ui/DocumentUpload";
import { useDocumentStore } from "@/features/documents/hooks/useDocumentStore";
import { Card } from "@/components/ui/card";

const Documents = () => {
  const { fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Documents</h1>
        </div>
        <DocumentUpload />
      </div>
      
      <Card className="p-6 bg-card">
        <DocumentList />
      </Card>
    </div>
  );
};

export default Documents;