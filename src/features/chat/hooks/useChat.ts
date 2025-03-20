import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { toast } from 'sonner';
import {
    appendMessageAtom,
    chatInputAtom,
    clearMessagesAtom,
    deleteMessageAtom,
    isComposingAtom,
    isSubmittingAtom,
    messagesAtom,
    updateMessageAtom,
} from '../atoms';
import { ChatService } from '../service';
import { useChatStore } from '../store';
import type { ChatMessage } from '../types';

export const useChat = () => {
  // Jotai atoms
  const [input, setInput] = useAtom(chatInputAtom);
  const [isComposing, setIsComposing] = useAtom(isComposingAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);
  const messages = useAtomValue(messagesAtom);
  const appendMessage = useSetAtom(appendMessageAtom);
  const updateMessage = useSetAtom(updateMessageAtom);
  const deleteMessage = useSetAtom(deleteMessageAtom);
  const clearMessages = useSetAtom(clearMessagesAtom);

  // Zustand store
  const {
    currentSessionId,
    currentMode,
    currentProvider,
    isOpen,
    toggleChat,
    setError
  } = useChatStore();

  const handleSubmit = useCallback(async () => {
    if (!currentSessionId || !input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const userMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
      content: input.trim(),
      role: 'user',
      sessionId: currentSessionId,
    };

    try {
      // Create user message
      const createdMessage = await ChatService.createMessage(userMessage);
      appendMessage(createdMessage);
      setInput('');

      // Get assistant response
      const assistantMessage = await ChatService.createMessage({
        content: 'Processing...',
        role: 'assistant',
        sessionId: currentSessionId,
      });
      appendMessage(assistantMessage);

      // TODO: Implement actual message processing with the current provider
      // This is just a placeholder
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve('This is a placeholder response. Implement actual provider integration.');
        }, 1000);
      });

      // Update assistant message with response
      const updatedMessage = await ChatService.updateMessage(assistantMessage.id, {
        content: response,
      });
      updateMessage(updatedMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentSessionId,
    input,
    isSubmitting,
    setInput,
    setIsSubmitting,
    appendMessage,
    updateMessage,
    setError,
  ]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, [setInput]);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, [setIsComposing]);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, [setIsComposing]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      await ChatService.deleteMessage(messageId);
      deleteMessage(messageId);
      toast.success('Message deleted');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [deleteMessage, setError]);

  const handleClearMessages = useCallback(async () => {
    if (!currentSessionId) return;

    try {
      // TODO: Implement bulk delete in the API
      const messagesToDelete = messages.map(msg => msg.id);
      await Promise.all(messagesToDelete.map(id => ChatService.deleteMessage(id)));
      clearMessages();
      toast.success('Messages cleared');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear messages';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [currentSessionId, messages, clearMessages, setError]);

  return {
    // State
    input,
    messages,
    isComposing,
    isSubmitting,
    isOpen,
    currentMode,
    currentProvider,

    // Actions
    handleSubmit,
    handleInputChange,
    handleCompositionStart,
    handleCompositionEnd,
    handleDeleteMessage,
    handleClearMessages,
    toggleChat,
  };
};
