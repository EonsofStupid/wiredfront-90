import React, { useEffect } from 'react';
import { useAuthStore } from '../store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const cleanup = initializeAuth();
    return () => {
      cleanup.then(unsubscribe => unsubscribe());
    };
  }, [initializeAuth]);

  return <>{children}</>;
};
