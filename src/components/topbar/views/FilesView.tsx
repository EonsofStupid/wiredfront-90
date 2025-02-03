import React from 'react';
import { Upload, FileUp, FolderUp, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FilesView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <FileUp className="h-6 w-6" />
          <span>Single File</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Upload className="h-6 w-6" />
          <span>Multiple Files</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <FolderUp className="h-6 w-6" />
          <span>Upload Folder</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Archive className="h-6 w-6" />
          <span>ZIP Upload</span>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <p className="text-center text-muted-foreground">
          Drag and drop files here or click on an upload option above
        </p>
      </div>
    </div>
  );
};