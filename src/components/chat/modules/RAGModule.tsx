
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenIcon } from "lucide-react";
import { KnowledgeSourceButton } from '../features/knowledge-source/KnowledgeSourceButton';

export function RAGModule() {
  return (
    <Card className="w-full my-2 border-dashed border-primary/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Knowledge Sources
          </h3>
          <Badge variant="outline" className="text-xs">RAG Enabled</Badge>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <KnowledgeSourceButton />
          <div className="text-xs text-muted-foreground flex-1">
            Access external knowledge to enhance AI responses
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
