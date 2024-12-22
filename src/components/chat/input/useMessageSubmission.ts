import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageLogger } from '@/services/chat/services/messaging/MessageLogger';
import { MessageProcessor } from '@/services/chat/services/messaging/MessageProcessor';
import { MessageQueue } from '@/services/chat/services/messaging/MessageQueue';

export const useMessageSubmission = (
  onSendMessage: (content: string) => void,
  sessionId: string
) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const messageLogger = new MessageLogger(sessionId);
  const messageProcessor = new MessageProcessor(sessionId);
  const messageQueue = new MessageQueue(sessionId);

  const handleFileUpload = async (files: File[]) => {
    setAttachments(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to message`);
  };

  const handleSubmit = async (message: string) => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      messageLogger.logMessageAttempt({ 
        id: crypto.randomUUID(),
        content: message,
        type: 'text'
      });

      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          messageLogger.logAttachmentUpload({
            name: file.name,
            type: file.type,
            size: file.size
          });

          const fileExt = file.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, file);
            
          if (error) {
            messageLogger.logAttachmentError(error, { name: file.name });
            throw error;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(filePath);
            
          messageLogger.logAttachmentSuccess({
            name: file.name,
            url: publicUrl
          });

          return {
            url: publicUrl,
            type: file.type,
            name: file.name
          };
        })
      );

      let finalContent = message;
      if (uploadedFiles.length > 0) {
        finalContent = JSON.stringify({
          text: message,
          attachments: uploadedFiles
        });
      }

      await messageQueue.enqueue({
        id: crypto.randomUUID(),
        content: finalContent,
        type: 'text',
        user_id: '', // Will be set by backend
        chat_session_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_minimized: false,
        metadata: {},
        position: { x: null, y: null },
        window_state: { width: 350, height: 500 },
        last_accessed: new Date().toISOString()
      });

      onSendMessage(finalContent);
      setAttachments([]);
    } catch (error) {
      console.error('Upload error:', error);
      messageLogger.logMessageError(error as Error);
      toast.error("Failed to upload file(s)");
    }
  };

  return {
    attachments,
    handleFileUpload,
    handleSubmit,
    setAttachments
  };
};