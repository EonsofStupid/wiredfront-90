
import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TokenAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TokenAuthGuard({ children, fallback }: TokenAuthGuardProps) {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  
  if (loading) {
    return <div className="animate-pulse h-4 w-24 bg-muted rounded" />;
  }
  
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert>
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          <p className="mb-2">You need to be logged in to view token information.</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
}
