import React from "react";
import { useDocumentStore } from "../hooks/useDocumentStore";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const DocumentList = () => {
  const { documents, deleteDocument } = useDocumentStore();

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FileText className="w-12 h-12 mb-2" />
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};