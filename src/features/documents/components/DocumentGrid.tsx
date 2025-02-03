import React from 'react';
import { useDocumentStore } from '../stores/documentStore';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const DocumentGrid = () => {
  const { documents, loading } = useDocumentStore();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-32 bg-muted" />
            <div className="h-8 mt-2 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold truncate">
                {doc.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};