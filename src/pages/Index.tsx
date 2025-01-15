import React from 'react';
import { DocumentUpload } from '@/components/documents/DocumentUpload';

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Document Upload</h1>
      <DocumentUpload />
    </div>
  );
};

export default Index;