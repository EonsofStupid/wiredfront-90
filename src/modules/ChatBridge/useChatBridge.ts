
import { useContext } from 'react';
import { ChatBridgeContext } from './ChatBridgeProvider';

/**
 * Hook to access the ChatBridge instance.
 * This is the only way to communicate with the isolated chat client.
 */
const useChatBridge = () => {
  const context = useContext(ChatBridgeContext);
  if (context === undefined) {
    throw new Error('useChatBridge must be used within a ChatBridgeProvider');
  }
  return context;
};

export default useChatBridge;
