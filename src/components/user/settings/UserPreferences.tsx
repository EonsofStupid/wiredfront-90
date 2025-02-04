import React from "react";
import { useUIStore } from "@/stores/ui";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserPreferences = () => {
  const { theme, accessibility, updateAccessibility } = useUIStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="text-muted-foreground">Customize your app experience</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reducedMotion">Reduced Motion</Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations throughout the app
            </p>
          </div>
          <Switch
            id="reducedMotion"
            checked={accessibility.reducedMotion}
            onCheckedChange={(checked) =>
              updateAccessibility({ reducedMotion: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="highContrast">High Contrast</Label>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            id="highContrast"
            checked={accessibility.highContrast}
            onCheckedChange={(checked) =>
              updateAccessibility({ highContrast: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select
            value={accessibility.fontSize}
            onValueChange={(value: "normal" | "large" | "xl") =>
              updateAccessibility({ fontSize: value })
            }
          >
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};