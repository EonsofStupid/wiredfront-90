import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentUpload } from '@/components/documents/DocumentUpload';

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Document Management</h1>
          </div>
          
          <div className="grid gap-6">
            <DocumentUpload />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;