
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIKeyCard } from "./api-key-card/APIKeyCard";

interface APIKeyListProps {
  configurations: APIConfiguration[];
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function APIKeyList({ 
  configurations, 
  onValidate, 
  onDelete, 
  onRefresh 
}: APIKeyListProps) {
  return (
    <div className="grid gap-6">
      {configurations.map((config) => (
        <APIKeyCard
          key={config.id}
          config={config}
          onValidate={onValidate}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
