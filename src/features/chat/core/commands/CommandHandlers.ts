import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DEV_COMMANDS } from './CommandRegistry';

export const registerDevCommands = (
  addMessage: (message: any) => Promise<void>,
  userId: string | undefined,
  isDevelopmentMode: boolean
) => {
  const handlers = new Map<string, (args: string) => Promise<void>>();

  if (isDevelopmentMode) {
    // Generate code command
    handlers.set(DEV_COMMANDS.GENERATE, async (args) => {
      await addMessage({
        content: `Generating code: ${args}`,
        type: 'system',
        user_id: userId,
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-code', {
          body: { prompt: args }
        });
        
        if (error) throw error;
        
        await addMessage({
          content: data.code,
          type: 'code',
          user_id: null,
          metadata: { language: data.language }
        });
      } catch (error) {
        toast.error('Failed to generate code');
        console.error('Error generating code:', error);
      }
    });

    // Refactor code command
    handlers.set(DEV_COMMANDS.REFACTOR, async (args) => {
      await addMessage({
        content: `Refactoring code: ${args}`,
        type: 'system',
        user_id: userId,
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('refactor-code', {
          body: { code: args }
        });
        
        if (error) throw error;
        
        await addMessage({
          content: data.refactoredCode,
          type: 'code',
          user_id: null,
          metadata: { changes: data.changes }
        });
      } catch (error) {
        toast.error('Failed to refactor code');
        console.error('Error refactoring code:', error);
      }
    });

    // Debug code command
    handlers.set(DEV_COMMANDS.DEBUG, async (args) => {
      await addMessage({
        content: `Debugging code: ${args}`,
        type: 'system',
        user_id: userId,
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('debug-code', {
          body: { code: args }
        });
        
        if (error) throw error;
        
        await addMessage({
          content: data.analysis,
          type: 'debug',
          user_id: null,
          metadata: { suggestions: data.suggestions }
        });
      } catch (error) {
        toast.error('Failed to debug code');
        console.error('Error debugging code:', error);
      }
    });

    // Add documentation command
    handlers.set(DEV_COMMANDS.DOCS, async (args) => {
      await addMessage({
        content: `Generating documentation: ${args}`,
        type: 'system',
        user_id: userId,
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-docs', {
          body: { code: args }
        });
        
        if (error) throw error;
        
        await addMessage({
          content: data.documentation,
          type: 'documentation',
          user_id: null,
          metadata: { format: data.format }
        });
      } catch (error) {
        toast.error('Failed to generate documentation');
        console.error('Error generating documentation:', error);
      }
    });
  }

  return handlers;
};