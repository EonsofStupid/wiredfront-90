
import { AIProviderCard } from "./AIProviderCard";
import { useAPIConfigurations } from "../../../hooks/core/useAPIConfigurations";

export function AIProviderList() {
  const { configurations, isLoading } = useAPIConfigurations('ai');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-6">
      {configurations.map((config) => (
        <AIProviderCard key={config.id} configuration={config} />
      ))}
    </div>
  );
}
