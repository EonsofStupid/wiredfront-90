
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SettingsContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsContainer({ title, description, children }: SettingsContainerProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
