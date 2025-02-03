import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Github, Clock, XCircle } from "lucide-react";
import type { ConnectionCardProps } from "../../types/connections";

export function ConnectionCard({ 
  connection,
  onToggleDefault,
  onDelete
}: ConnectionCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Github className="h-4 w-4" />
              {connection.account_username}
              {connection.is_default && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Type: {connection.account_type}</span>
              {connection.last_used && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last used: {new Date(connection.last_used).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Default</span>
              <Switch
                checked={connection.is_default}
                onCheckedChange={(checked) => onToggleDefault(connection.id, checked)}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(connection.id)}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}