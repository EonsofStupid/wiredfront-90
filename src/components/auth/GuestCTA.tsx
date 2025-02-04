import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

export const GuestCTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
        <span className="text-sm">Sign in to access all features</span>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};