import React from 'react';
import { DocumentList } from '@/features/documents/ui/DocumentList';
import { DocumentUpload } from '@/features/documents/ui/DocumentUpload';

const Documents = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Documents</h1>
      <DocumentUpload />
      <DocumentList />
    </div>
  );
};

export default Documents;