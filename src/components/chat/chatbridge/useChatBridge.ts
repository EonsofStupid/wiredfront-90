
import { useEffect, useState, useCallback, useRef } from 'react';
import ChatBridge from './ChatBridge';
import { BridgeEvent, BridgeMessage, BridgeSettings, ChatMode, ConnectionStatus } from './types';

export function useChatBridge() {
  const bridge = useRef(ChatBridge.getInstance());
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    bridge.current.getConnectionStatus()
  );
  const [settings, setSettings] = useState<BridgeSettings>(
    bridge.current.settings
  );

  // Set up event listeners
  useEffect(() => {
    // Get initial state
    setMessages(bridge.current.getMessages());
    setConnectionStatus(bridge.current.getConnectionStatus());
    setSettings(bridge.current.settings);

    // Set up event listener
    const unsubscribe = bridge.current.addListener((event: BridgeEvent) => {
      switch (event.type) {
        case 'message:send':
        case 'message:receive':
        case 'message:update':
          setMessages(bridge.current.getMessages());
          break;
        case 'connection:change':
          setConnectionStatus(event.payload);
          break;
        case 'settings:update':
          setSettings(event.payload);
          break;
        case 'mode:change':
          setSettings(prev => ({ ...prev, mode: event.payload }));
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Action handlers
  const sendMessage = useCallback(
    (content: string) => bridge.current.sendMessage(content),
    []
  );

  const updateSettings = useCallback(
    (newSettings: Partial<BridgeSettings>) => bridge.current.updateSettings(newSettings),
    []
  );

  const setMode = useCallback(
    (mode: ChatMode) => bridge.current.setMode(mode),
    []
  );

  const clearMessages = useCallback(
    () => bridge.current.clearMessages(),
    []
  );

  return {
    messages,
    connectionStatus,
    settings,
    sendMessage,
    updateSettings,
    setMode,
    clearMessages,
  };
}
