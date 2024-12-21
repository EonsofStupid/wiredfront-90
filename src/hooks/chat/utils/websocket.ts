import { createElement } from 'react';
import { SignalHigh, CloudOff } from 'lucide-react';
import { toast } from 'sonner';

export const calculateRetryDelay = (retryAttempts: number, jitter = 0.2): number => {
  const baseDelay = Math.min(1000 * Math.pow(2, retryAttempts), 30000);
  const randomFactor = 1 - jitter + (Math.random() * jitter * 2);
  return Math.floor(baseDelay * randomFactor);
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

export const calculateLatency = (start: number): number => {
  return Date.now() - start;
};

export const calculateUptime = (connectedAt: Date | null): number => {
  if (!connectedAt) return 0;
  return Date.now() - connectedAt.getTime();
};