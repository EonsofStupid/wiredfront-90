import React, { useEffect } from "react";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { useDocumentStore } from "@/stores/documents/store";

const Documents = () => {
  const { fetchDocuments } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-lighter/30 to-transparent">
      <DocumentGrid />
    </div>
  );
};

export default Documents;