
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ValidationStatusType } from "@/integrations/supabase/types";
import { ConfigurationStatus } from "@/features/admin/api-settings/components/shared/ConfigurationStatus";

interface ServiceCardProps {
  title: string;
  description: string;
  status: ValidationStatusType;
  onDelete?: () => void;
  onUpdate?: (updates: any) => void;
}

export function ServiceCard({
  title,
  description,
  status,
  onDelete,
  onUpdate
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <ConfigurationStatus status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end space-x-2">
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
