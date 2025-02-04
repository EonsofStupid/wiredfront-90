import React from "react";
import { DocumentsLayout } from "@/components/documents/layout/DocumentsLayout";
import { DocumentHeader } from "@/components/documents/DocumentHeader";
import { DocumentGrid } from "@/components/documents/DocumentGrid";

const Documents = () => {
  return (
    <DocumentsLayout>
      <div className="container mx-auto">
        <DocumentHeader />
        <DocumentGrid />
      </div>
    </DocumentsLayout>
  );
};

export default Documents;