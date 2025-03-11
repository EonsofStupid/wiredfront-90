
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyAPIKeysListProps {
  onAddKey: () => void;
}

export function EmptyAPIKeysList({ onAddKey }: EmptyAPIKeysListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No API Keys</CardTitle>
        <CardDescription>
          You haven't configured any API keys yet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Add your first API key to start using AI services and other integrations.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onAddKey}
          className="admin-primary-button w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First API Key
        </Button>
      </CardFooter>
    </Card>
  );
}
