
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, KeyRound, Shield } from "lucide-react";
import { SettingsContainer } from "../../layout/SettingsContainer";

export function OAuthConnectionsSettings() {
  return (
    <SettingsContainer
      title="OAuth Provider Settings"
      description="Configure OAuth provider credentials for your application users"
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>OAuth Configuration</CardTitle>
            <CardDescription>Manage OAuth provider credentials for application-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Client Credentials</h3>
                    <p className="text-sm text-muted-foreground">Configure OAuth client IDs and secrets</p>
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Permissions</h3>
                    <p className="text-sm text-muted-foreground">Manage OAuth scopes and permissions</p>
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsContainer>
  );
}
