import type { SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../client';
import type { SupabaseContext } from '../types';

const SupabaseContext = createContext<SupabaseContext | null>(null);

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verify the connection
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('health_check').select('*').limit(1);
        if (error) throw error;
        setIsInitialized(true);
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsInitialized(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <SupabaseContext.Provider value={{ client: supabase, isInitialized }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseContext => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export const useSupabaseClient = (): SupabaseClient => {
  return useSupabase().client;
};
