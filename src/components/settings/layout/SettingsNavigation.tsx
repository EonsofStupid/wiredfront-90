
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface SettingsNavigationProps {
  tabs: SettingsTab[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
}

export function SettingsNavigation({ 
  tabs, 
  defaultValue = "general",
  onTabChange
}: SettingsNavigationProps) {
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs 
      defaultValue={defaultValue} 
      value={defaultValue}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-6">
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
