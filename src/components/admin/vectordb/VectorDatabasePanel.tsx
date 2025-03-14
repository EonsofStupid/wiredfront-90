
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ProjectVector } from "@/types/admin/vector-database";
import { AlertCircle, Database, Trash2 } from "lucide-react";

export const VectorDatabasePanel = () => {
  const queryClient = useQueryClient();
  const [expandedVector, setExpandedVector] = useState<string | null>(null);

  // Fetch project vectors with project information
  const { data: vectors = [], isLoading, error } = useQuery({
    queryKey: ["project-vectors"],
    queryFn: async (): Promise<ProjectVector[]> => {
      // Use direct table access with join instead of RPC
      const { data, error } = await supabase
        .from('project_vectors')
        .select(`
          id,
          project_id,
          vector_data,
          embedding,
          created_at,
          updated_at,
          projects:project_id (
            name,
            user_id
          )
        `);

      if (error) {
        console.error("Error fetching project vectors:", error);
        throw error;
      }

      return data || [];
    }
  });

  // Delete a vector
  const deleteMutation = useMutation({
    mutationFn: async (vectorId: string) => {
      const { error } = await supabase
        .from('project_vectors')
        .delete()
        .eq('id', vectorId);
      
      if (error) throw error;
      return vectorId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-vectors"] });
      toast.success("Vector deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting vector:", error);
      toast.error("Failed to delete vector");
    }
  });

  // Format bytes to a human-readable size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Toggle vector details expansion
  const toggleVectorDetails = (vectorId: string) => {
    setExpandedVector(expandedVector === vectorId ? null : vectorId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vector Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vector Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 border rounded-md bg-red-50 text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              Error loading vector database: {(error as Error).message}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Vector Database
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vectors && vectors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Vector Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vectors.map((vector) => (
                <React.Fragment key={vector.id}>
                  <TableRow>
                    <TableCell className="font-medium">{vector.project?.name || 'Unknown Project'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vector.embedding.length} dimensions</Badge>
                    </TableCell>
                    <TableCell>{new Date(vector.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleVectorDetails(vector.id)}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMutation.mutate(vector.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedVector === vector.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted/50 p-4">
                        <div className="text-sm">
                          <p className="font-semibold mb-2">Vector Data:</p>
                          <pre className="bg-muted p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(vector.vector_data, null, 2)}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Database className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No vectors found</h3>
            <p className="text-muted-foreground mt-2">
              Vector embeddings will appear here once projects are indexed for RAG.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
