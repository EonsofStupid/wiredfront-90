import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface SettingsContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsContainer({ title, description, children }: SettingsContainerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
}