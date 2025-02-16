
import { ServiceConfigurationCard } from "./ServiceConfigurationCard";
import { ServiceProviderConfig } from "../../types/service-config.types";
import { APIConfiguration } from "../../types/api-config.types";
import { getProvidersByType } from "../../utils/providers";

interface ServiceConfigurationListProps {
  type: 'ai' | 'vector' | 'voice' | 'storage' | 'development';
  configurations: APIConfiguration[];
}

export function ServiceConfigurationList({ type, configurations }: ServiceConfigurationListProps) {
  const providers = getProvidersByType(type);

  return (
    <div className="grid gap-4">
      {providers.map((provider) => (
        <ServiceConfigurationCard
          key={provider.type}
          provider={provider}
          configuration={configurations.find(c => c.api_type === provider.type)}
        />
      ))}
    </div>
  );
}
