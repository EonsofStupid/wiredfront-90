
import { useContext } from 'react';
import { ChatBridgeContext } from './ChatBridgeProvider';

const useChatBridge = () => {
  const context = useContext(ChatBridgeContext);
  if (context === undefined) {
    throw new Error('useChatBridge must be used within a ChatBridgeProvider');
  }
  return context;
};

export default useChatBridge;
