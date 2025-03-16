
import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { useRoleStore } from '@/stores/role';
import { GuestCTA } from '@/components/auth/GuestCTA';

interface TokenAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
  fallback?: React.ReactNode;
}

export const TokenAuthGuard: React.FC<TokenAuthGuardProps> = ({
  children,
  requiredRole,
  fallback
}) => {
  const { isAuthenticated } = useAuthStore();
  const { hasRole } = useRoleStore();
  
  // Check if user has required role (if specified)
  const hasRequiredRole = !requiredRole || hasRole(requiredRole);
  
  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <GuestCTA
        title="Token Access Required"
        description="Please sign in to manage your tokens and access this feature."
      />
    );
  }
  
  if (requiredRole && !hasRequiredRole) {
    return (
      <div className="p-4 border border-amber-200 rounded-md bg-amber-50">
        <h3 className="font-medium text-amber-800 mb-2">Insufficient Permissions</h3>
        <p className="text-sm text-amber-700">
          You need {requiredRole} permissions to access this functionality.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};
