
import { APIConfiguration } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { APIKeyHeader } from "./APIKeyHeader";
import { APIKeyList } from "./APIKeyList";
import { EmptyAPIKeysList } from "./EmptyAPIKeysList";
import { APIKeysSkeletonLoader } from "./APIKeysSkeletonLoader";
import { Card, CardContent } from "@/components/ui/card";

interface KeyManagementContentProps {
  isLoading: boolean;
  configurations: APIConfiguration[];
  hasConfigurations: boolean;
  onAddKey: () => void;
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function KeyManagementContent({
  isLoading,
  configurations,
  hasConfigurations,
  onAddKey,
  onValidate,
  onDelete,
  onRefresh
}: KeyManagementContentProps) {
  return (
    <Card className="border-gray-800 bg-slate-900/30 shadow-md">
      <CardContent className="p-6">
        <div className="grid gap-6">
          <APIKeyHeader onAddKey={onAddKey} />

          {isLoading && configurations.length === 0 ? (
            <APIKeysSkeletonLoader />
          ) : hasConfigurations ? (
            <APIKeyList
              configurations={configurations}
              onValidate={onValidate}
              onDelete={onDelete}
              onRefresh={onRefresh}
            />
          ) : (
            <EmptyAPIKeysList onAddKey={onAddKey} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
