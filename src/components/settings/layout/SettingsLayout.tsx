import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";

interface SettingsLayoutProps {
  children?: React.ReactNode;
  defaultTab?: string;
}

export function SettingsLayout({ children, defaultTab = "general" }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
      </div>
      {children}
    </div>
  );
}