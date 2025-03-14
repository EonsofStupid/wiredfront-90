
import { useState } from "react";
import { Helmet } from "react-helmet";
import { SystemLogsPanel } from "@/components/admin/logging/SystemLogsPanel";
import { FileText } from "lucide-react";

export default function SystemLogsPage() {
  return (
    <>
      <Helmet>
        <title>System Logs | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              System Logs
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage system-wide logs for debugging and auditing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SystemLogsPanel />
        </div>
      </div>
    </>
  );
}
