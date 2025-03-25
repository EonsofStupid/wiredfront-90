
import { AlertCircle } from "lucide-react";

interface GitHubErrorMessageProps {
  errorMessage: string | null;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
}

export function GitHubErrorMessage({ errorMessage, connectionStatus }: GitHubErrorMessageProps) {
  if (!errorMessage || connectionStatus !== 'error') return null;
  
  return (
    <div className="p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium mb-1">GitHub Connection Error</p>
        <p className="text-sm">{errorMessage}</p>
        {errorMessage.includes('not configured') && (
          <p className="text-sm mt-2">
            Make sure the GitHub client ID and secret are configured in your Supabase Edge Function secrets.
          </p>
        )}
      </div>
    </div>
  );
}
