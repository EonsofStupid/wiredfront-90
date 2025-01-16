import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

const Documents = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Documents</h1>
        </div>
        
        {/* Your document system will be integrated here */}
        <div className="rounded-lg border bg-card p-8">
          <p className="text-muted-foreground">
            Document management system loading...
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documents;