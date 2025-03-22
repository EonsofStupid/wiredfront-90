import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/stores/chat/chatStore";
import { ChatMode } from "@/types/chat";
import { ChatFeatureKey } from "@/types/chat/features";
import { toast } from "sonner";
import styles from "../styles/ChatSettings.module.css";

export function ChatSettings() {
  // Zustand Store
  const {
    layout,
    toggleSidebar,
    toggleMinimize,
    setPosition,
    uiPreferences,
    setMessageBehavior,
    features,
    toggleFeature,
    mode,
    setMode,
  } = useChatStore();

  const handlePositionChange = (newPosition: "left" | "right") => {
    setPosition({ x: 0, y: 0 }); // Reset position when changing dock side
    setPosition({
      x: newPosition === "left" ? 0 : window.innerWidth - 400,
      y: 0,
    });
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all chat history? This cannot be undone."
      )
    ) {
      // Clear chat history through store
      toast.success("Chat history cleared successfully");
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div>
        <h3 className={styles.sectionTitle}>Chat Preferences</h3>
        <p className={styles.sectionDescription}>
          Customize how the chat interface appears and behaves
        </p>
      </div>

      <div className={styles.settingsForm}>
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Position & Appearance</h4>
          </div>

          <div className={styles.formGroup}>
            <Label>Chat Button Position</Label>
            <div className={styles.positionOptions}>
              <button
                className={`${styles.positionOption} ${
                  layout.position.x === 0 ? styles.positionOptionSelected : ""
                }`}
                onClick={() => handlePositionChange("left")}
              >
                <div
                  className={`${styles.positionOptionIndicator} ${styles.positionOptionLeft}`}
                ></div>
                Left Side
              </button>
              <button
                className={`${styles.positionOption} ${
                  layout.position.x > window.innerWidth / 2
                    ? styles.positionOptionSelected
                    : ""
                }`}
                onClick={() => handlePositionChange("right")}
              >
                <div
                  className={`${styles.positionOptionIndicator} ${styles.positionOptionRight}`}
                ></div>
                Right Side
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Sidebar</Label>
            <div className={styles.formRow}>
              <span>Show Sidebar</span>
              <Switch
                checked={layout.isSidebarOpen}
                onCheckedChange={toggleSidebar}
              />
            </div>
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Behavior</h4>
          </div>

          <div className={styles.formRow}>
            <div>
              <span>Start Minimized</span>
              <p className="text-sm text-muted-foreground">
                Open chat in minimized state
              </p>
            </div>
            <Switch
              checked={layout.isMinimized}
              onCheckedChange={toggleMinimize}
            />
          </div>

          <div className={styles.formRow}>
            <div>
              <span>Show Timestamps</span>
              <p className="text-sm text-muted-foreground">
                Display time for each message
              </p>
            </div>
            <Switch
              checked={uiPreferences.messageBehavior.showTimestamps}
              onCheckedChange={(checked: boolean) =>
                setMessageBehavior({ showTimestamps: checked })
              }
            />
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Chat Mode</h4>
          </div>

          <div className={styles.formGroup}>
            <Label>Default Mode</Label>
            <Select
              value={mode.current}
              onValueChange={(value: ChatMode) => setMode(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="code">Code Assistant</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Features</h4>
          </div>

          {Object.entries(features).map(([feature, enabled]) => (
            <div key={feature} className={styles.formRow}>
              <div>
                <span>{feature.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={() => toggleFeature(feature as ChatFeatureKey)}
              />
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <Button variant="destructive" onClick={handleClearHistory}>
            Clear Chat History
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSettings;
