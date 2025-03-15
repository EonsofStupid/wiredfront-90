
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore } from '@/components/chat/store/chatStore';

interface GenerateImageParams {
  prompt: string;
  sessionId?: string;
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
}

interface GenerateImageResult {
  success: boolean;
  imageUrl?: string;
  messageId?: string;
  error?: string;
}

export class ImageGenerationService {
  /**
   * Generate an image based on the prompt
   */
  static async generateImage({ 
    prompt, 
    sessionId, 
    size = '1024x1024', 
    n = 1 
  }: GenerateImageParams): Promise<GenerateImageResult> {
    try {
      logger.info('Generating image', { prompt, size, n });
      
      // Call the Supabase Edge function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          size, 
          n 
        }
      });
      
      if (error) throw error;
      
      if (!data?.imageUrl) {
        throw new Error('No image URL in response');
      }
      
      // Register the image in the database if session is provided
      let messageId;
      if (sessionId) {
        messageId = await this.recordImageGeneration(prompt, data.imageUrl, sessionId);
      }
      
      logger.info('Image generated successfully', { messageId });
      
      return {
        success: true,
        imageUrl: data.imageUrl,
        messageId
      };
    } catch (error) {
      logger.error('Error generating image:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate image'
      };
    }
  }
  
  /**
   * Record the image generation in the database
   */
  private static async recordImageGeneration(
    prompt: string,
    imageUrl: string,
    sessionId: string
  ): Promise<string> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('User not authenticated');
      
      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      // Insert message record with type 'image' which we've added to our DB enum
      const { error } = await supabase.from('messages').insert({
        id: messageId,
        content: prompt,
        user_id: userData.user.id,
        chat_session_id: sessionId,
        message_status: 'sent',
        type: 'image',
        metadata: {
          imageUrl,
          timestamp,
          type: 'generated'
        },
        role: 'assistant'
      });
      
      if (error) throw error;
      
      // Track feature usage
      await supabase.from('feature_usage').insert({
        user_id: userData.user.id,
        feature_name: 'image_generation',
        context: {
          sessionId,
          prompt,
          timestamp
        }
      });
      
      return messageId;
    } catch (error) {
      logger.error('Error recording image generation:', error);
      throw error;
    }
  }
  
  /**
   * Save a generated image to the gallery
   */
  static async saveImageToGallery(
    imageUrl: string,
    prompt: string,
    messageId?: string
  ): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('User not authenticated');
      
      // Get current session
      const store = useChatStore.getState();
      const { currentSession } = store;
      
      // Convert data URL to blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const shortPrompt = prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
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
        
      // Save metadata to our new gallery_images table
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          file_path: data.path,
          public_url: urlData.publicUrl,
          prompt: prompt,
          message_id: messageId,
          session_id: currentSession?.id,
          user_id: userData.user.id,
          metadata: {
            originalSource: 'chat',
            size: blob.size,
            type: blob.type
          }
        });
        
      if (insertError) throw insertError;
      
      logger.info('Image saved to gallery', { prompt });
      
      return true;
    } catch (error) {
      logger.error('Error saving image to gallery:', error);
      return false;
    }
  }
  
  /**
   * Get images for a session
   */
  static async getSessionImages(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      logger.error('Error getting session images:', error);
      return [];
    }
  }
}
