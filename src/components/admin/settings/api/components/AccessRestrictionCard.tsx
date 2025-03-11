
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";

export function AccessRestrictionCard() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-destructive" />
          Access Restricted
        </CardTitle>
        <CardDescription>
          You don't have permission to manage API keys. This feature is restricted to Super Admin users.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
