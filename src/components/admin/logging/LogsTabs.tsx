
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function LogsTabs({ activeTab, setActiveTab }: LogsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 w-full sm:w-auto">
        <TabsTrigger value="all">All Logs</TabsTrigger>
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="warn">Warnings</TabsTrigger>
        <TabsTrigger value="error">Errors</TabsTrigger>
        <TabsTrigger value="debug">Debug</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
