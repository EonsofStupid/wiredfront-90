
import React from 'react';
import { useAPIConfigurations } from '../../../hooks/core/useAPIConfigurations';
import { VectorConfiguration } from '../../../types/providers/vector';
import { ServiceCard } from '@/components/ui/card';

export function VectorStoreList() {
  const { configurations, isLoading, createConfiguration, updateConfiguration, deleteConfiguration } = useAPIConfigurations('vector');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const vectorConfigurations = configurations.map(config => ({
    ...config,
    memorable_name: config.memorable_name || `${config.api_type}_${new Date(config.created_at || '').getTime()}`
  })) as VectorConfiguration[];

  return (
    <div className="grid gap-4">
      {vectorConfigurations.map((config) => (
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
