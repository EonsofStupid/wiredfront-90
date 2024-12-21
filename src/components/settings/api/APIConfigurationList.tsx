import { APIConfigurationProps } from "@/types/settings/api-configuration";
import { API_CONFIGURATIONS } from "@/constants/api-configurations";
import { APIConfigurationCard } from "./APIConfigurationCard";

export function APIConfigurationList({ configurations, onConfigurationChange, onSetDefault }: APIConfigurationProps) {
  return (
    <div className="grid gap-4">
      {API_CONFIGURATIONS.map((api) => {
        const config = configurations.find(c => c.api_type === api.type);
        return (
          <APIConfigurationCard
            key={api.type}
            config={config}
            api={api}
            onConfigurationChange={onConfigurationChange}
            onSetDefault={onSetDefault}
          />
        );
      })}
    </div>
  );
}