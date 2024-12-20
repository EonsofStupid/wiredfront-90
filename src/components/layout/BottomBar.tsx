import { useSettingsStore } from "@/stores/settings";

export function BottomBar() {
  const { preferences } = useSettingsStore();

  return (
    <footer className="bottom-bar glass-card border-t border-border/20">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <span className="text-sm text-foreground/60">
          © 2024 wiredFRONT. All rights reserved.
        </span>
        {preferences.showVersion && (
          <span className="text-sm text-foreground/60">Version 1.0.0</span>
        )}
      </div>
    </footer>
  );
}