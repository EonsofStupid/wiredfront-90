import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, Trash2 } from "lucide-react";
export const VectorDatabasePanel = () => {
    const queryClient = useQueryClient();
    const [expandedVector, setExpandedVector] = useState(null);
    // Fetch project vectors with project information
    const { data: vectors = [], isLoading, error } = useQuery({
        queryKey: ["project-vectors"],
        queryFn: async () => {
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
        mutationFn: async (vectorId) => {
            const { error } = await supabase
                .from('project_vectors')
                .delete()
                .eq('id', vectorId);
            if (error)
                throw error;
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
    const formatSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    };
    // Toggle vector details expansion
    const toggleVectorDetails = (vectorId) => {
        setExpandedVector(expandedVector === vectorId ? null : vectorId);
    };
    if (isLoading) {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Vector Database" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-8 w-full" }), _jsx(Skeleton, { className: "h-64 w-full" })] }) })] }));
    }
    if (error) {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Vector Database" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center p-4 border rounded-md bg-red-50 text-red-700", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2" }), _jsxs("div", { children: ["Error loading vector database: ", error.message] })] }) })] }));
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "Vector Database"] }) }), _jsx(CardContent, { children: vectors && vectors.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Project" }), _jsx(TableHead, { children: "Vector Size" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: vectors.map((vector) => (_jsxs(React.Fragment, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: vector.project?.name || 'Unknown Project' }), _jsx(TableCell, { children: _jsxs(Badge, { variant: "outline", children: [vector.embedding.length, " dimensions"] }) }), _jsx(TableCell, { children: new Date(vector.created_at).toLocaleDateString() }), _jsx(TableCell, { children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => toggleVectorDetails(vector.id), children: "Details" }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => deleteMutation.mutate(vector.id), disabled: deleteMutation.isPending, children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }), expandedVector === vector.id && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, className: "bg-muted/50 p-4", children: _jsxs("div", { className: "text-sm", children: [_jsx("p", { className: "font-semibold mb-2", children: "Vector Data:" }), _jsx("pre", { className: "bg-muted p-2 rounded overflow-auto max-h-40", children: JSON.stringify(vector.vector_data, null, 2) })] }) }) }))] }, vector.id))) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [_jsx(Database, { className: "h-10 w-10 text-muted-foreground mb-4" }), _jsx("h3", { className: "text-lg font-medium", children: "No vectors found" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Vector embeddings will appear here once projects are indexed for RAG." })] })) })] }));
};
