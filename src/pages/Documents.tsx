import React from "react";
import { DocumentsLayout } from "@/components/documents/DocumentsLayout";

const Documents = () => {
  return (
    <DocumentsLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 gradient-text">Documents</h1>
        {/* Document content will go here */}
      </div>
    </DocumentsLayout>
  );
};

export default Documents;
