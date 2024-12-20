import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-foreground hover:text-primary"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </Button>
  );
}