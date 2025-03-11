
import { Button } from "@/components/ui/button";
import { Plus, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyAPIKeysListProps {
  onAddKey: () => void;
}

export function EmptyAPIKeysList({ onAddKey }: EmptyAPIKeysListProps) {
  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <ShieldAlert className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No API Keys Configured</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Add API keys to enable AI services like OpenAI, Anthropic, and vector databases for RAG functionality.
        </p>
        <Button 
          className="admin-primary-button"
          onClick={onAddKey}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add First API Key
        </Button>
      </CardContent>
    </Card>
  );
}
