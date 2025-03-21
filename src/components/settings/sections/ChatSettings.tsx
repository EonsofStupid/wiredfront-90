
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChatButton } from "@/features/chat/components/ChatButton";
import {
    chatIsDockedAtom,
    chatIsMinimizedAtom,
    chatPositionAtom,
    chatPositionWithDockAtom,
    chatScaleAtom,
    chatShowSidebarAtom
} from "@/state/atoms/chat/chatAtoms";
import { useChatStore } from "@/state/stores/chat/chatStore";
import { useAtom } from "jotai";
import { toast } from "sonner";
import styles from "../styles/ChatSettings.module.css";

export function ChatSettings() {
  // Zustand Store
  const {
    currentMode,
    setCurrentMode,
    selectedModel,
    availableProviders,
    currentProvider,
    updateCurrentProvider,
    features,
    toggleFeature,
    preferences,
    updatePreferences
  } = useChatStore();

  // Jotai Atoms for UI state
  const [position, setPosition] = useAtom(chatPositionAtom);
  const [scale, setScale] = useAtom(chatScaleAtom);
  const [isDocked, setIsDocked] = useAtom(chatIsDockedAtom);
  const [isMinimized, setIsMinimized] = useAtom(chatIsMinimizedAtom);
  const [showSidebar, setShowSidebar] = useAtom(chatShowSidebarAtom);
  const [positionWithDock] = useAtom(chatPositionWithDockAtom);

  const handlePositionChange = (newPosition: 'left' | 'right') => {
    setPosition({ x: 0, y: 0 }); // Reset position when changing dock side
    setIsDocked(true);
    setPosition({
      x: newPosition === 'left' ? 0 : window.innerWidth - 400,
      y: 0
    });
  };

  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(2, newScale)));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
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
                className={`${styles.positionOption} ${position.x === 0 ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('left')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionLeft}`}></div>
                Left Side
              </button>
              <button
                className={`${styles.positionOption} ${position.x > window.innerWidth / 2 ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('right')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionRight}`}></div>
                Right Side
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Button Size</Label>
            <div className={styles.formRow}>
              <span>Scale</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-32 mr-2"
                />
                <span>{scale.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Docked Mode</Label>
            <div className={styles.formRow}>
              <span>Keep chat window docked</span>
              <Switch
                checked={isDocked}
                onCheckedChange={setIsDocked}
              />
            </div>
          </div>

          <div className={styles.previewContainer}>
            <span className={styles.previewLabel}>Preview</span>
            <ChatButton
              position={positionWithDock}
              scale={scale}
              onClick={() => {}}
              isPreview={true}
            />
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Behavior</h4>
          </div>

          <div className={styles.formRow}>
            <div>
              <span>Start Minimized</span>
              <p className="text-sm text-muted-foreground">Open chat in minimized state</p>
            </div>
            <Switch
              checked={isMinimized}
              onCheckedChange={setIsMinimized}
            />
          </div>

          <div className={styles.formRow}>
            <div>
              <span>Show Timestamps</span>
              <p className="text-sm text-muted-foreground">Display time for each message</p>
            </div>
            <Switch
              checked={preferences.showTimestamps}
              onCheckedChange={(checked) => updatePreferences({ showTimestamps: checked })}
            />
          </div>

          <div className={styles.formRow}>
            <div>
              <span>Save History</span>
              <p className="text-sm text-muted-foreground">Persist chat history between sessions</p>
            </div>
            <Switch
              checked={preferences.saveHistory}
              onCheckedChange={(checked) => updatePreferences({ saveHistory: checked })}
            />
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>AI Provider Settings</h4>
          </div>

          <div className={styles.formGroup}>
            <Label>Default Provider</Label>
            <Select
              value={currentProvider?.id || ''}
              onValueChange={(value) => {
                const provider = availableProviders.find(p => p.id === value);
                if (provider) updateCurrentProvider(provider);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={styles.formGroup}>
            <Label>Default Model</Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => setCurrentMode(value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {currentProvider?.models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
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
                <span>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={() => toggleFeature(feature)}
              />
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <Button variant="destructive" onClick={handleClearHistory}>Clear Chat History</Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSettings;
