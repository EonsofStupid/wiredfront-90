
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state
    const cleanup = initializeAuth();
    return () => cleanup();
  }, [initializeAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
