import React from "react";

interface SettingsContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsContainer({ title, description, children }: SettingsContainerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}