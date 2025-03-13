
import { AlertCircle, ShieldCheck } from "lucide-react";

interface GitHubTokenValidationProps {
  error: string;
  validationState: "idle" | "validating" | "valid" | "invalid";
  validationResult: any;
}

export function GitHubTokenValidation({
  error,
  validationState,
  validationResult
}: GitHubTokenValidationProps) {
  if (!error && validationState !== "valid") {
    return null;
  }

  return (
    <>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}
      
      {validationState === "valid" && validationResult && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start">
          <ShieldCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-100">Token is valid!</p>
            <p>Connected to GitHub account: <span className="font-medium">@{validationResult.user.login}</span></p>
            <p className="text-xs text-muted-foreground mt-1">
              Rate limit: {validationResult.rate_limit.remaining}/{validationResult.rate_limit.limit} requests remaining
            </p>
          </div>
        </div>
      )}
    </>
  );
}
