
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Github, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GitHubTokenCardProps {
  token: any;
  onDelete: () => void;
}

export function GitHubTokenCard({ token, onDelete }: GitHubTokenCardProps) {
  const isValid = token.validation_status === 'valid';
  const lastValidated = token.last_validated ? formatDistanceToNow(new Date(token.last_validated), { addSuffix: true }) : 'never';
  const username = token.provider_settings?.github_username || 'Unknown';
  
  return (
    <Card className="border-[#8B5CF6]/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center">
              <Github className="h-4 w-4 mr-2 text-[#8B5CF6]" />
              {token.memorable_name}
            </CardTitle>
            <CardDescription>
              Connected to @{username}
            </CardDescription>
          </div>
          <Badge className={isValid ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : 
                                     "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"}>
            {isValid ? (
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid
              </span>
            ) : (
              <span className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Invalid
              </span>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">
            <span className="font-medium text-foreground">Last validated:</span> {lastValidated}
          </p>
          {token.provider_settings?.scopes && (
            <p>
              <span className="font-medium text-foreground">Scopes:</span> {Array.isArray(token.provider_settings.scopes) ? token.provider_settings.scopes.join(', ') : 'N/A'}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-[#8B5CF6]/10 pt-4 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="border-red-500/20 text-red-500 hover:bg-red-500/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
