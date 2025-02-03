import React from 'react';
import { useDocumentStore } from '@/stores/documents/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Folder } from 'lucide-react';

export const DocumentGrid = () => {
  const { documents, loading } = useDocumentStore();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted" />
            <CardContent className="h-8 mt-2 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-2">
              {doc.category ? (
                <Folder className="h-5 w-5 text-muted-foreground" />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-base truncate">{doc.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};