
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { type ValidationStatusType } from "@/integrations/supabase/types";

interface ConfigurationStatusProps {
  status: ValidationStatusType | null;
}

export function ConfigurationStatus({ status }: ConfigurationStatusProps) {
  const getStatusColor = (status: ValidationStatusType | null) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500';
      case 'invalid':
        return 'bg-red-500';
      case 'expired':
        return 'bg-yellow-500';
      case 'rate_limited':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)}`}>
      {status || 'pending'}
    </Badge>
  );
}
