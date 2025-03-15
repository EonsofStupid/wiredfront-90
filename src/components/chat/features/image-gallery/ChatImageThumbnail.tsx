
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, X, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useChatStore } from "../../store/chatStore";
import { cn } from "@/lib/utils";

interface ChatImageThumbnailProps {
  imageUrl: string;
  prompt?: string;
  messageId?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ChatImageThumbnail({ 
  imageUrl, 
  prompt,
  messageId,
  size = 'md' 
}: ChatImageThumbnailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { currentSession } = useChatStore();
  
  const handleSaveToGallery = async () => {
    if (!imageUrl || isSaved) return;
    
    setIsSaving(true);
    try {
      // Convert base64 data URL to Blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const shortPrompt = prompt ? prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_') : 'image';
      const filename = `${shortPrompt}_${timestamp}.png`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(`user_images/${filename}`, blob, {
          contentType: 'image/png',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(`user_images/${filename}`);
        
      // Save metadata to database
      await supabase.from('gallery_images').insert({
        file_path: data.path,
        public_url: urlData.publicUrl,
        prompt: prompt,
        message_id: messageId,
        session_id: currentSession?.id,
        metadata: {
          originalSource: 'chat',
          size: blob.size,
          type: blob.type
        }
      });
      
      setIsSaved(true);
      toast.success('Image saved to gallery');
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image to gallery');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  return (
    <>
      <div className="relative group">
        <button
          onClick={() => setIsDialogOpen(true)}
          className={cn(
            "rounded-md overflow-hidden border border-chat-image-border hover:border-chat-image-border-hover transition-all duration-200",
            sizeClasses[size]
          )}
        >
          <img 
            src={imageUrl} 
            alt={prompt || "Generated image"} 
            className="h-full w-full object-cover"
          />
        </button>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:text-white hover:bg-black/60"
            onClick={() => setIsDialogOpen(true)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-auto bg-chat-dialog-bg border-chat-dialog-border">
          <DialogHeader>
            <DialogTitle className="text-chat-dialog-title flex items-center justify-between">
              <span>{prompt || "Generated Image"}</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-chat-dialog-close hover:text-chat-dialog-close-hover">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="max-h-[60vh] overflow-auto rounded-md border border-chat-image-border">
              <img 
                src={imageUrl} 
                alt={prompt || "Generated image"} 
                className="max-w-full h-auto object-contain"
              />
            </div>
            
            <div className="flex items-center justify-between w-full px-2">
              {prompt && (
                <div className="text-sm text-muted-foreground max-w-[80%] truncate">
                  {prompt}
                </div>
              )}
              
              <Button
                onClick={handleSaveToGallery}
                disabled={isSaving || isSaved}
                className={cn(
                  "ml-auto",
                  isSaved && "bg-green-600 hover:bg-green-700"
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isSaved ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Gallery
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
