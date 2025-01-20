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
    <div className="flex justify-end mb-6">
      <Button 
        disabled={loading}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default DocumentUpload;