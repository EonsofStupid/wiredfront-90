
import React from "react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { VectorDatabasePanel } from "@/components/admin/vectordb/VectorDatabasePanel";
import { Database } from "lucide-react";

export default function VectorDatabasePage() {
  return (
    <div className="container max-w-7xl mx-auto py-10 space-y-6">
      <h1 className="admin-heading text-3xl font-bold tracking-tight">Vector Database Management</h1>
      <p className="text-muted-foreground">
        Manage RAG vectors for AI retrieval, adjust indexing rules, and view which projects are indexed.
      </p>
      
      <div className="grid gap-6">
        <VectorDatabasePanel />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="Indexing Rules"
            description="Configure how projects are indexed and how vectors are created"
            icon={<Database className="h-5 w-5" />}
          >
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
          
          <AdminCard
            title="System Status"
            description="Vector database statistics and performance metrics"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Vectors</p>
                  <p className="text-2xl font-bold mt-1">
                    {/* This would be dynamic in a real implementation */}
                    250
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Indexed Projects</p>
                  <p className="text-2xl font-bold mt-1">
                    {/* This would be dynamic in a real implementation */}
                    18
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Query Time</p>
                  <p className="text-2xl font-bold mt-1">45ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Reindex</p>
                  <p className="text-2xl font-bold mt-1">2h ago</p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
