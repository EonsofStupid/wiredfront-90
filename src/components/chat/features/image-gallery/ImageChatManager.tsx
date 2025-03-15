
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useProviderChanges } from '@/hooks/useProviderChanges';
import { toast } from 'sonner';
import { useSession } from '@supabase/auth-helpers-react';
import { logger } from '@/services/chat/LoggingService';

export function ImageChatManager() {
  const location = useLocation();
  const { 
    currentMode, 
    currentSession, 
    createSession,
    getCurrentPageMode
  } = useChatStore();
  const { 
    availableProviders, 
    changeProvider
  } = useProviderChanges();
  const session = useSession();
  
  // Check if we're on the gallery page
  const isGalleryPage = location.pathname.includes('/gallery');
  
  // Effect to handle mode switching when navigating to gallery
  useEffect(() => {
    if (!isGalleryPage || !session) return;
    
    const pageMode = getCurrentPageMode();
    
    // Switch to image mode when on gallery page
    if (pageMode === 'image' && (!currentSession || currentSession.mode !== 'image')) {
      logger.info('Switching to image mode for gallery page');
      
      try {
        // Find an image generation provider
        const imageProvider = availableProviders.find(p => p.category === 'image');
        
        if (!imageProvider) {
          toast.error('No image generation provider available');
          return;
        }
        
        // Create an image session
        const sessionId = createSession('image', {
          title: 'Image Generation Session'
        });
        
        // Switch to the image provider
        changeProvider(imageProvider.id, 'auto_gallery_page');
        
        logger.info('Created image generation session', { 
          sessionId,
          provider: imageProvider.name 
        });
      } catch (error) {
        logger.error('Failed to initialize image mode:', error);
        toast.error('Failed to initialize image mode');
      }
    }
  }, [isGalleryPage, currentMode, getCurrentPageMode, createSession, availableProviders, changeProvider, currentSession, session]);
  
  return null; // This is a logic-only component
}
