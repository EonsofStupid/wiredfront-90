import React from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentUpload = () => {
  const { uploadDocument, loading } = useDocumentStore();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocument(file);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  return (
    <div>
      <Button 
        variant="outline"
        className="flex items-center gap-2"
        disabled={loading}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-4 w-4" />
        Upload Document
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".txt,.pdf,.doc,.docx"
      />
    </div>
  );
};

export default DocumentUpload;