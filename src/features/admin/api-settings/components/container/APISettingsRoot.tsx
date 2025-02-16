
import React from "react";
import { APISettingsTabs } from "./APISettingsTabs";
import { RoleGate } from "@/components/auth/RoleGate";

export function APISettingsRoot() {
  return (
    <RoleGate allowedRoles={['admin', 'super_admin']}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">API Settings</h1>
        </div>
        <APISettingsTabs />
      </div>
    </RoleGate>
  );
}
