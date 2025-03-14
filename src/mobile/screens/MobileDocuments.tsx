
import React from "react";
import { Folder, File, Star, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-optimized documents screen with filter tabs
 */
export const MobileDocuments = () => {
  const [activeTab, setActiveTab] = React.useState("all");
  
  // Sample documents data
  const documents = [
    { id: '1', name: 'Project Proposal', type: 'file', starred: true, updated: '2 hours ago', tags: ['important'] },
    { id: '2', name: 'Research Folder', type: 'folder', starred: false, updated: 'Yesterday', tags: [] },
    { id: '3', name: 'Design Guidelines', type: 'file', starred: true, updated: '3 days ago', tags: ['reference'] },
    { id: '4', name: 'API Documentation', type: 'file', starred: false, updated: 'Last week', tags: ['technical'] },
    { id: '5', name: 'Assets', type: 'folder', starred: false, updated: '2 weeks ago', tags: [] }
  ];
  
  // Filter documents based on active tab
  const filteredDocuments = documents.filter(doc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'starred') return doc.starred;
    if (activeTab === 'recent') return doc.updated.includes('hours') || doc.updated.includes('Yesterday');
    return true;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center overflow-x-auto pb-2 no-scrollbar">
        <TabButton 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
          label="All"
        />
        <TabButton 
          active={activeTab === 'starred'} 
          onClick={() => setActiveTab('starred')}
          label="Starred"
          icon={<Star className="h-3 w-3" />}
        />
        <TabButton 
          active={activeTab === 'recent'} 
          onClick={() => setActiveTab('recent')}
          label="Recent"
          icon={<Clock className="h-3 w-3" />}
        />
      </div>
      
      <div className="space-y-2">
        {filteredDocuments.map(doc => (
          <DocumentItem 
            key={doc.id}
            name={doc.name}
            type={doc.type}
            starred={doc.starred}
            updated={doc.updated}
            tags={doc.tags}
          />
        ))}
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neon-pink/60 text-sm">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tab button component for document filtering
 */
const TabButton = ({ 
  active, 
  onClick, 
  label, 
  icon 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm whitespace-nowrap mr-2",
      "transition-colors duration-200",
      active 
        ? "bg-neon-blue/20 text-neon-blue" 
        : "bg-dark-lighter text-neon-pink/80 hover:bg-dark-lighter/80"
    )}
  >
    <div className="flex items-center gap-1">
      {icon}
      {label}
    </div>
  </button>
);

/**
 * Document item component for the list
 */
const DocumentItem = ({ 
  name, 
  type, 
  starred, 
  updated,
  tags
}: { 
  name: string; 
  type: 'file' | 'folder'; 
  starred: boolean;
  updated: string;
  tags: string[];
}) => (
  <div className="p-3 rounded-lg bg-dark-lighter border border-neon-blue/20 hover:bg-dark-lighter/70 transition-colors">
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center mr-3">
        {type === 'folder' ? (
          <Folder className="h-4 w-4 text-neon-blue" />
        ) : (
          <File className="h-4 w-4 text-neon-pink" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{name}</h3>
          {starred && <Star className="h-3 w-3 text-yellow-400" />}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-neon-pink/60 mt-1">
          <span>{updated}</span>
          {tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tags.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
