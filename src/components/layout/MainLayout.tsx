import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";
import { TopBar } from "./TopBar";
import { SideBar } from "./SideBar";
import { BottomBar } from "./BottomBar";
import { ContentArea } from "./ContentArea";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences } = useSettingsStore();

  useEffect(() => {
    // Initialize layout preferences
    const savedPreferences = localStorage.getItem("layout-preferences");
    if (savedPreferences) {
      updatePreferences(JSON.parse(savedPreferences));
    }
  }, [updatePreferences]);

  return (
    <div className="layout-grid min-h-screen bg-background">
      <TopBar />
      <SideBar />
      <ContentArea>{children}</ContentArea>
      <BottomBar />
    </div>
  );
}