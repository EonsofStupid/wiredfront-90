
import { APIConfigurationProps } from "@/types/admin/settings/api-configuration";
import { API_CONFIGURATIONS } from "@/constants/api-configurations";
import { APIConfigurationCard } from "./APIConfigurationCard";
import { useRoleStore } from "@/stores/role";
import { cn } from "@/lib/utils";

export function APIConfigurationList({ 
  configurations, 
  onConfigurationChange, 
  onSetDefault,
  onDelete 
}: APIConfigurationProps) {
  const { roles } = useRoleStore();
  const isSuperAdmin = roles.includes('super_admin');

  return (
    <div className={cn(
      "grid gap-4 p-4",
      "bg-background/80 backdrop-blur-sm",
      "border rounded-lg shadow-lg",
      "transition-all duration-300 ease-in-out"
    )}>
      {API_CONFIGURATIONS.map((api) => {
        const config = configurations.find(c => c.api_type === api.type);
        return (
          <APIConfigurationCard
            key={api.type}
            config={config}
            api={api}
            onConfigurationChange={onConfigurationChange}
            onSetDefault={onSetDefault}
            onDelete={onDelete}
            isSuperAdmin={isSuperAdmin}
          />
        );
      })}
    </div>
  );
}
