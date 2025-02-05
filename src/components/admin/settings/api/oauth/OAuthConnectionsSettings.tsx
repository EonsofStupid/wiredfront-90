import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, FolderGit2 } from "lucide-react";

export function OAuthConnectionsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth Connections</CardTitle>
        <CardDescription>Manage your OAuth provider connections</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          <Github className="mr-2 h-4 w-4" />
          Connect GitHub
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <FolderGit2 className="mr-2 h-4 w-4" />
          Select Repositories
        </Button>
      </CardContent>
    </Card>
  );
}