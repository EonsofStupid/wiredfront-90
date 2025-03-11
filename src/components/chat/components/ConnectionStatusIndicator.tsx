
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ConnectionStatusIndicator() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check initial connection status
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('chat_sessions').select('id').limit(1);
        setIsConnected(!error);
      } catch (error) {
        setIsConnected(false);
      }
    };
    
    checkConnection();
    
    // Set up regular connection checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    // Add offline/online event listeners
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-neon-teal" />
            ) : (
              <WifiOff className="h-4 w-4 text-neon-pink animate-pulse" />
            )}
            <span 
              className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                isConnected ? 'bg-neon-teal' : 'bg-neon-pink'
              } ${
                isConnected ? 'animate-pulse' : 'animate-ping'
              }`} 
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
