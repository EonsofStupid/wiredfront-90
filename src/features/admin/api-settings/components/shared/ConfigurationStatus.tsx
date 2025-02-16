
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ValidationStatusType } from '@/integrations/supabase/types';

interface ConfigurationStatusProps {
  status: ValidationStatusType;
}

export function ConfigurationStatus({ status }: ConfigurationStatusProps) {
  const getStatusConfig = (status: ValidationStatusType) => {
    switch (status) {
      case 'valid':
        return { variant: 'success' as const, label: 'Valid' };
      case 'invalid':
        return { variant: 'destructive' as const, label: 'Invalid' };
      case 'expired':
        return { variant: 'secondary' as const, label: 'Expired' };
      case 'rate_limited':
        return { variant: 'outline' as const, label: 'Rate Limited' };
      case 'error':
        return { variant: 'destructive' as const, label: 'Error' };
      case 'pending':
      default:
        return { variant: 'secondary' as const, label: 'Pending' };
    }
  };

  const { variant, label } = getStatusConfig(status);

  return (
    <Badge variant={variant}>{label}</Badge>
  );
}
