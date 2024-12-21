import { toast } from 'sonner';
import { SignalHigh, CloudOff } from 'lucide-react';
import { createElement } from 'react';

export const calculateRetryDelay = (retryAttempts: number): number => {
  const backoff = Math.min(1000 * Math.pow(2, retryAttempts), 30000);
  // Add jitter to prevent thundering herd
  return backoff * (0.8 + Math.random() * 0.4);
};

export const handleConnectionSuccess = () => {
  toast.success('Connected to chat service', {
    icon: createElement('div', { className: 'h-5 w-5' }, createElement(SignalHigh))
  });
};

export const handleConnectionError = (error: Error) => {
  console.error('WebSocket error:', error);
  toast.error('Connection lost. Reconnecting...', {
    icon: createElement('div', { className: 'h-5 w-5' }, createElement(CloudOff))
  });
};

export const handleMaxRetriesExceeded = () => {
  toast.error('Unable to establish connection. Please try again later.', {
    duration: 5000
  });
};