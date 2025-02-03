import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectionCard } from "../ConnectionCard";
import type { ConnectionListProps } from "../../types/connections";

export function ConnectionsList({
  connections,
  isLoading,
  onToggleDefault,
  onDelete
}: ConnectionListProps) {
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