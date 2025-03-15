
import { Helmet } from "react-helmet";
import { NavigationLogsPanel } from "@/components/admin/logging/NavigationLogsPanel";
import { Route } from "lucide-react";

export default function NavigationLogsPage() {
  return (
    <>
      <Helmet>
        <title>Navigation Logs | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Route className="h-6 w-6" />
              Navigation Logs
            </h1>
            <p className="text-muted-foreground">
              Track user navigation across the platform for analytics and debugging
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <NavigationLogsPanel />
        </div>
      </div>
    </>
  );
}
