
import { useContext } from 'react';
import { ChatBridgeContext } from './ChatBridgeProvider';
import { chatBridge } from './ChatBridge';

/**
 * Hook to access the ChatBridge instance
 */
const useChatBridge = () => {
  const context = useContext(ChatBridgeContext);
  
  if (!context && process.env.NODE_ENV !== 'production') {
    console.warn(
      'useChatBridge was called outside of ChatBridgeProvider. ' +
      'Falling back to the default instance.'
    );
    return chatBridge;
  }
  
  return context || chatBridge;
};

export default useChatBridge;
