
import { Button } from "@/components/ui/button";
import { Key, PlusCircle } from "lucide-react";

interface APIKeyHeaderProps {
  onAddKey: () => void;
}

export function APIKeyHeader({ onAddKey }: APIKeyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-lg flex items-center">
          <Key className="w-5 h-5 mr-2" />
          API Configurations
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys and configurations for different services
        </p>
      </div>
      <Button 
        className="admin-primary-button"
        onClick={onAddKey}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New API Key
      </Button>
    </div>
  );
}
