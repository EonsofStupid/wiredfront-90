import React, { useEffect } from "react";
import { DocumentHeader } from "@/components/documents/DocumentHeader";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { useDocumentStore } from "@/stores/documents/store";

const Documents = () => {
  const { fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="flex flex-col h-full">
      <DocumentHeader />
      <DocumentGrid />
    </div>
  );
};

export default Documents;