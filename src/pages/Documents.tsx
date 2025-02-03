import React, { useEffect, useState } from "react";
import { DocumentsTopBar } from "@/features/documents/components/DocumentsTopBar";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { useDocumentStore } from "@/stores/documents/store";

const Documents = () => {
  const { fetchDocuments } = useDocumentStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-lighter/30 to-transparent">
      <DocumentsTopBar
        view={view}
        onViewChange={setView}
        onSearch={handleSearch}
      />
      <DocumentGrid />
    </div>
  );
};

export default Documents;