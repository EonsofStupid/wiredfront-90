import React from 'react';
import { useRoleStore } from '@/stores/role';
import { useAuthStore } from '@/stores/auth';
import { GuestCTA } from './GuestCTA';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { roles } = useRoleStore();
  const { isAuthenticated } = useAuthStore();

  const hasPermission = roles.some(role => allowedRoles.includes(role));

  if (!isAuthenticated) {
    return <GuestCTA />;
  }

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this feature.
          {roles.includes('guest') && " Please upgrade your account to gain access."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}