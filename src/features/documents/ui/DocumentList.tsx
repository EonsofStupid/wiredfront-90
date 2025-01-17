import React from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DocumentList = () => {
  const { documents, loading } = useDocumentStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No documents found. Upload some documents to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base truncate">{doc.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Badge 
                variant={doc.status === 'indexed' ? 'default' : 
                        doc.status === 'processing' ? 'secondary' : 
                        doc.status === 'failed' ? 'destructive' : 'outline'}
              >
                {doc.status}
              </Badge>
              {doc.error_message && (
                <p className="text-sm text-destructive mt-2">
                  Error: {doc.error_message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;