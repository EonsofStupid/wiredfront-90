
import { useAPIConfigurations } from "../../../hooks/core/useAPIConfigurations";
import { VectorStoreCard } from "./VectorStoreCard";
import { VectorConfiguration } from "../../../types/providers/vector";

export function VectorStoreList() {
  const { configurations, isLoading } = useAPIConfigurations('vector');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-6">
      {configurations.map((config) => (
        <VectorStoreCard 
          key={config.id} 
          configuration={config as VectorConfiguration} 
        />
      ))}
    </div>
  );
}
