import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const mountedRef = useRef(true);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    if (!mountedRef.current) return;
    
    const items = Array.from(e.clipboardData.items);
    
    items.forEach((item) => {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setAttachments(prev => [...prev, file]);
          toast.success("Image added to message", {
            id: `paste-success-${Date.now()}`
          });
        }
      }
    });
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mountedRef.current) return;
    
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to message`, {
      id: `file-select-success-${Date.now()}`
    });
  }, []);

  const clearAttachments = useCallback(() => {
    if (mountedRef.current) {
      setAttachments([]);
    }
  }, []);

  return { 
    attachments, 
    setAttachments: useCallback((files: File[]) => {
      if (mountedRef.current) {
        setAttachments(files);
      }
    }, []), 
    handlePaste, 
    handleFileSelect,
    clearAttachments 
  };
};