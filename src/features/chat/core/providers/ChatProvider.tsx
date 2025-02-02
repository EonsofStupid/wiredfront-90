import React, { createContext, useContext, useCallback } from 'react';
import { ChatWindow } from '../../ui/ChatWindow';
import { useMessageStore } from '../messaging/MessageManager';
import { useWindowStore } from '../window/WindowManager';
import { useCommandStore } from '../commands/CommandRegistry';
import { EditorModeProvider, useEditorMode } from './EditorModeProvider';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';

interface ChatContextValue {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

const ChatProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addMessage, clearMessages } = useMessageStore();
  const { setPosition } = useWindowStore();
  const { user } = useAuthStore();
  const { isEditorMode, generateCode, modifyFile, viewProject } = useEditorMode();

  const fetchActiveConfig = useCallback(async () => {
    try {
      const { data: config, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_enabled', true)
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return config;
    } catch (error) {
      console.error('Error fetching API configuration:', error);
      toast.error('Failed to load AI provider configuration');
      return null;
    }
  }, [user?.id]);

  const sendMessage = useCallback(async (content: string) => {
    if (content.startsWith('/')) {
      const [command, ...args] = content.slice(1).split(' ');
      
      if (isEditorMode) {
        switch (command) {
          case 'generate':
            await generateCode(args.join(' '));
            break;
          case 'modify':
            const [filePath, ...codeContent] = args;
            await modifyFile(filePath, codeContent.join(' '));
            break;
          case 'view':
            await viewProject();
            break;
          default:
            await useCommandStore.getState().executeCommand(command, args.join(' '));
        }
      } else {
        await useCommandStore.getState().executeCommand(command, args.join(' '));
      }
      return;
    }

    await addMessage({
      content,
      type: 'text',
      user_id: user?.id,
      metadata: { mode: isEditorMode ? 'development' : 'chat' }
    });

    try {
      const config = await fetchActiveConfig();
      if (!config) {
        toast.error('No active AI provider configured');
        return;
      }

      const functionName = isEditorMode ? 'generate-code' : 'chat-completion';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { message: content, config_id: config.id }
      });

      if (error) throw error;

      await addMessage({
        content: data.response,
        type: 'text',
        user_id: null,
        metadata: {
          provider: config.api_type,
          mode: isEditorMode ? 'development' : 'chat'
        }
      });
    } catch (error) {
      toast.error('Failed to generate response');
      console.error('Error:', error);
    }
  }, [addMessage, user, isEditorMode, generateCode, modifyFile, viewProject, fetchActiveConfig]);

  React.useEffect(() => {
    setPosition('bottom-right');
    return () => setPosition('bottom-right');
  }, [setPosition]);

  const value = {
    sendMessage,
    clearChat: clearMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatWindow />
    </ChatContext.Provider>
  );
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EditorModeProvider>
      <ChatProviderInner>{children}</ChatProviderInner>
    </EditorModeProvider>
  );
};