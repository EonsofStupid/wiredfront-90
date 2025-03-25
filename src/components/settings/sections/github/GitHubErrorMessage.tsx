
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubErrorMessageProps {
  errorMessage: string | null;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
}

export function GitHubErrorMessage({ 
  errorMessage, 
  connectionStatus 
}: GitHubErrorMessageProps) {
  if (connectionStatus !== 'error' || !errorMessage) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
}
