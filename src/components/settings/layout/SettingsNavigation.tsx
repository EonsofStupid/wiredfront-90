import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface SettingsNavigationProps {
  tabs: SettingsTab[];
  defaultValue?: string;
}

export function SettingsNavigation({ tabs, defaultValue = "general" }: SettingsNavigationProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          <div className="glass-card p-6">
            {tab.content}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}