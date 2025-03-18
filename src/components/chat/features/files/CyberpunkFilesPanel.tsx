
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, File, Folder, FileText, FileCode, Image as ImageIcon, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'code';
  size?: string;
  modified: string;
  path: string;
}

const CyberpunkFilesPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  
  // Sample files - would be fetched from a service in a real implementation
  const files: FileItem[] = [
    {
      id: 'f1',
      name: 'Documents',
      type: 'folder',
      modified: '2023-08-12',
      path: '/Documents'
    },
    {
      id: 'f2',
      name: 'project.md',
      type: 'file',
      size: '12KB',
      modified: '2023-08-10',
      path: '/project.md'
    },
    {
      id: 'f3',
      name: 'app.tsx',
      type: 'code',
      size: '4KB',
      modified: '2023-08-05',
      path: '/app.tsx'
    },
    {
      id: 'f4',
      name: 'diagram.png',
      type: 'image',
      size: '250KB',
      modified: '2023-08-01',
      path: '/diagram.png'
    }
  ];
  
  // Filter files based on search
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Icon mapping based on file type
  const fileIcons = {
    folder: <Folder className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
    code: <FileCode className="h-4 w-4" />,
    image: <ImageIcon className="h-4 w-4" />
  };

  return (
    <div className="chat-cyberpunk-files-panel">
      <div className="chat-cyberpunk-files-search">
        <Search className="chat-cyberpunk-files-search-icon" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="chat-cyberpunk-files-search-input"
        />
      </div>
      
      <div className="chat-cyberpunk-files-path">
        <span>Current path: {currentPath}</span>
        <Button variant="outline" size="sm" className="chat-cyberpunk-files-upload">
          <Upload className="h-3 w-3 mr-1" /> 
          Upload
        </Button>
      </div>
      
      <div className="chat-cyberpunk-files-list">
        {filteredFiles.length === 0 ? (
          <div className="chat-cyberpunk-files-empty">
            No files found. Try a different search.
          </div>
        ) : (
          filteredFiles.map(file => (
            <div 
              key={file.id} 
              className="chat-cyberpunk-files-item"
              onClick={() => file.type === 'folder' && setCurrentPath(file.path)}
            >
              <div className="chat-cyberpunk-files-item-icon">
                {fileIcons[file.type]}
              </div>
              
              <div className="chat-cyberpunk-files-item-content">
                <div className="chat-cyberpunk-files-item-name">
                  {file.name}
                </div>
                
                <div className="chat-cyberpunk-files-item-meta">
                  {file.size && <span className="chat-cyberpunk-files-item-size">{file.size}</span>}
                  <span className="chat-cyberpunk-files-item-modified">{file.modified}</span>
                </div>
              </div>
              
              <div className="chat-cyberpunk-files-item-actions">
                <Button variant="ghost" size="sm" className="chat-cyberpunk-files-item-action">
                  Use
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CyberpunkFilesPanel;
