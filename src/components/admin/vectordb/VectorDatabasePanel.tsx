
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Database, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProjectVector {
  id: string;
  project_id: string;
  vector_data: any;
  embedding: number[];
  created_at?: string;
  project_name?: string;
}

export function VectorDatabasePanel() {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: vectors, isLoading, error, refetch } = useQuery({
    queryKey: ["projectVectors"],
    queryFn: async (): Promise<ProjectVector[]> => {
      const { data, error } = await supabase
        .from('project_vectors')
        .select(`
          *,
          projects:project_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to include project name
      return data.map(vector => ({
        ...vector,
        project_name: vector.projects?.name || 'Unknown Project'
      }));
    }
  });

  const deleteVectorMutation = useMutation({
    mutationFn: async (vectorId: string) => {
      setIsDeleting(vectorId);
      const { error } = await supabase
        .from('project_vectors')
        .delete()
        .eq('id', vectorId);
      
      if (error) throw error;
      return vectorId;
    },
    onSuccess: () => {
      toast.success("Vector deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projectVectors"] });
      setIsDeleting(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete vector: ${error.message}`);
      setIsDeleting(null);
    }
  });

  const handleDeleteVector = (vectorId: string) => {
    if (confirm("Are you sure you want to delete this vector? This action cannot be undone.")) {
      deleteVectorMutation.mutate(vectorId);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading vector database...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h3 className="font-semibold text-lg">Error Loading Vectors</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
            <Button variant="outline" onClick={() => refetch()} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vector Database Management</CardTitle>
        <CardDescription>
          Manage core RAG vectors for AI retrieval across projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {vectors && vectors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Vector Dimensions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vectors.map((vector) => (
                <TableRow key={vector.id}>
                  <TableCell className="font-medium">
                    {vector.project_name}
                    <Badge variant="outline" className="ml-2">
                      {vector.project_id.substring(0, 8)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>{vector.embedding.length} dimensions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vector.created_at ? new Date(vector.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVector(vector.id)}
                      disabled={isDeleting === vector.id}
                    >
                      {isDeleting === vector.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-2">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 border rounded-md">
            <Database className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-lg">No Vectors Available</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              There are no vectors in the database yet. Vectors will be created when users add content to their projects.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
