import React, { useEffect } from "react";
import { DocumentGrid } from "../components/DocumentGrid";
import { DocumentHeader } from "../components/DocumentHeader";
import { useDocumentStore } from "../stores/documentStore";

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