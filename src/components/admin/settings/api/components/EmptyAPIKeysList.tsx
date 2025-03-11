
import { Button } from "@/components/ui/button";
import { Key, Plus } from "lucide-react";

interface EmptyAPIKeysListProps {
  onAddKey: () => void;
}

export function EmptyAPIKeysList({ onAddKey }: EmptyAPIKeysListProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-700 rounded-lg bg-slate-900/30 text-center">
      <div className="rounded-full bg-slate-800 p-4 mb-4">
        <Key className="h-8 w-8 text-indigo-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-200 mb-2">No API Keys Configured</h3>
      
      <p className="text-gray-400 max-w-md mb-6">
        Add API keys to connect external services like OpenAI, Anthropic, or GitHub to enhance your application's functionality.
      </p>
      
      <Button
        onClick={onAddKey}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Your First API Key
      </Button>
    </div>
  );
}
