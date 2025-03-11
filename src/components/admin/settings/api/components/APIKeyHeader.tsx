
import { Button } from "@/components/ui/button";
import { Key, Plus, PlusCircle } from "lucide-react";

interface APIKeyHeaderProps {
  onAddKey: () => void;
}

export function APIKeyHeader({ onAddKey }: APIKeyHeaderProps) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-800">
      <div>
        <h3 className="font-medium text-xl flex items-center text-white">
          <Key className="w-6 h-6 mr-2 text-indigo-400" />
          API Configurations
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Manage your API keys and configurations for different services
        </p>
      </div>
      <Button 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
        onClick={onAddKey}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New API Key
      </Button>
    </div>
  );
}
