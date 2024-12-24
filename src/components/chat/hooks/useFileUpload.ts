import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    
    items.forEach((item) => {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setAttachments(prev => [...prev, file]);
          toast.success("Image added to message");
        }
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to message`);
  };

  return { attachments, setAttachments, handlePaste, handleFileSelect };
};