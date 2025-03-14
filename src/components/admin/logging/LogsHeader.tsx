
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function LogsHeader() {
  return (
    <CardHeader>
      <CardTitle className="text-xl font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5" />
        System Logs
      </CardTitle>
      <CardDescription>
        View and manage system logs from across the application
      </CardDescription>
    </CardHeader>
  );
}
