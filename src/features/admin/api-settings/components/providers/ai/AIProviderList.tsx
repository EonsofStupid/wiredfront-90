
import React from 'react';
import { useAPIConfigurations } from '../../../hooks/core/useAPIConfigurations';
import { AIConfiguration } from '../../../types/providers/ai';
import { ServiceCard } from '@/components/ui/card';

export function AIProviderList() {
  const { configurations, isLoading, createConfiguration, updateConfiguration, deleteConfiguration } = useAPIConfigurations('ai');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const aiConfigurations = configurations.map(config => ({
    ...config,
    memorable_name: config.memorable_name || `${config.api_type}_${new Date(config.created_at || '').getTime()}`
  })) as AIConfiguration[];

  return (
    <div className="grid gap-4">
      {aiConfigurations.map((config) => (
        <ServiceCard
          key={config.id}
          title={config.memorable_name}
          description={`${config.api_type} Configuration`}
          status={config.validation_status}
          onDelete={() => deleteConfiguration.mutate(config.id)}
          onUpdate={(updates) => updateConfiguration.mutate({ id: config.id, updates })}
        />
      ))}
    </div>
  );
}
