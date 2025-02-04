import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OAuthConnection } from "@/types/settings/api-configuration";
import { ConnectionCard } from "../oauth/ConnectionCard";

interface ConnectionsListProps {
  connections: OAuthConnection[] | undefined;
  isLoading: boolean;
  onToggleDefault: (connectionId: string, isDefault: boolean) => void;
  onDelete: (connectionId: string) => void;
}

export function ConnectionsList({
  connections,
  isLoading,
  onToggleDefault,
  onDelete
}: ConnectionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!connections?.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            No GitHub accounts connected yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          onToggleDefault={onToggleDefault}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}