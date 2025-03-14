
import React from "react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { VectorDatabasePanel } from "@/components/admin/vectordb/VectorDatabasePanel";
import { Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VectorIndexingStats } from "@/types/admin/vector-database";

export default function VectorDatabasePage() {
  // Fetch vector indexing statistics
  const { data: stats = {
    total_vectors: 0,
    indexed_projects: 0,
    average_query_time: "N/A",
    last_reindex: "N/A"
  } } = useQuery({
    queryKey: ["vector-indexing-stats"],
    queryFn: async (): Promise<VectorIndexingStats> => {
      // In a real implementation, this would fetch actual stats
      // For now, we'll simulate it with hardcoded data
      return {
        total_vectors: 250,
        indexed_projects: 18,
        average_query_time: "45ms",
        last_reindex: "2h ago"
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <div className="container max-w-7xl mx-auto py-10 space-y-6">
      <h1 className="admin-heading text-3xl font-bold tracking-tight">Vector Database Management</h1>
      <p className="text-muted-foreground">
        Manage RAG vectors for AI retrieval, adjust indexing rules, and view which projects are indexed.
      </p>
      
      <div className="grid gap-6">
        <VectorDatabasePanel />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Indexing Rules" icon={<Database className="h-5 w-5" />}>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Current Indexing Settings</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Auto-index new projects:</div>
                  <div>Enabled</div>
                  <div className="font-medium">Vector dimensions:</div>
                  <div>1536</div>
                  <div className="font-medium">Indexing frequency:</div>
                  <div>On content change</div>
                </div>
              </div>
            </div>
          </AdminCard>
          
          <AdminCard title="System Status" icon={<Database className="h-5 w-5" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Vectors</p>
                  <p className="text-2xl font-bold mt-1">{stats.total_vectors}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Indexed Projects</p>
                  <p className="text-2xl font-bold mt-1">{stats.indexed_projects}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Query Time</p>
                  <p className="text-2xl font-bold mt-1">{stats.average_query_time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Reindex</p>
                  <p className="text-2xl font-bold mt-1">{stats.last_reindex}</p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
