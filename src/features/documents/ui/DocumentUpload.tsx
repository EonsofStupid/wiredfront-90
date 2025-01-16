import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "../hooks/useDocumentStore";
import { toast } from "sonner";

export const DocumentUpload = () => {
  const { uploadDocument } = useDocumentStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocument(file);
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Upload Document
      </Button>
    </div>
  );
};