import React from 'react';
import { DocumentUpload } from '@/components/documents/DocumentUpload';

const Documents = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neon-blue">Document Management</h1>
        </div>
        <DocumentUpload />
      </div>
    </div>
  );
};

export default Documents;