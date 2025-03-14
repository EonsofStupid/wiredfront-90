
import React from "react";
import { AdminTopNav } from "./TopNav";
import { cn } from "@/lib/utils";

export const AdminTopNavOverlay: React.FC = () => {
  return (
    <div className="wf-admin-nav-container">
      <AdminTopNav className="wf-admin-nav" />
    </div>
  );
};
