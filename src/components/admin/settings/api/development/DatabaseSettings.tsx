
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export function DatabaseSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connections
        </CardTitle>
        <CardDescription>
          Manage database connection strings for development
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="p-8 text-center border rounded-md">
          <Database className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Database connection management coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
