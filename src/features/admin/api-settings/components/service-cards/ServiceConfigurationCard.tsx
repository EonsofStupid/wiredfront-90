
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceConfigurationForm } from "../shared/ServiceConfigurationForm";
import { ConfigurationStatus } from "../shared/ConfigurationStatus";
import { MetricsDisplay } from "../shared/MetricsDisplay";
import { APIConfiguration } from "../../types/api-config.types";
import { ServiceProviderConfig } from "../../types/service-config.types";

interface ServiceConfigurationCardProps {
  provider: ServiceProviderConfig;
  configuration?: APIConfiguration;
}

export function ServiceConfigurationCard({ provider, configuration }: ServiceConfigurationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{provider.label}</CardTitle>
          {configuration && <ConfigurationStatus status={configuration.validation_status} />}
        </div>
        <CardDescription>{provider.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configuration ? (
          <>
            <MetricsDisplay configuration={configuration} />
            {/* Additional configuration management UI will be added */}
          </>
        ) : (
          <ServiceConfigurationForm provider={provider} />
        )}
      </CardContent>
    </Card>
  );
}
