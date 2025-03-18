import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useChatStore } from "@/components/chat/store/chatStore";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/ChatSettings.module.css";
import ChatToggleButton from "@/components/chat/components/ChatToggleButton";

export function ChatSettings() {
  const { 
    position,
    togglePosition,
    setPosition,
    docked,
    toggleDocked,
    scale,
    setScale,
    features,
    toggleFeature
  } = useChatStore();

  const handlePositionChange = (newPosition: string) => {
    if (newPosition !== position) {
      setPosition(newPosition as "bottom-right" | "bottom-left");
    }
  };

  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(2, newScale)));
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
              <div 
                className={`${styles.positionOption} ${position === 'bottom-left' ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('bottom-left')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionLeft}`}></div>
                Bottom Left
              </div>
              <div 
                className={`${styles.positionOption} ${position === 'bottom-right' ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('bottom-right')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionRight}`}></div>
                Bottom Right
              </div>
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
                checked={docked} 
                onCheckedChange={toggleDocked}
              />
            </div>
          </div>

          <div className={styles.previewContainer}>
            <span className={styles.previewLabel}>Preview</span>
            <div 
              style={{
                position: 'relative',
                [position === 'bottom-left' ? 'left' : 'right']: '0',
                transform: `scale(${scale})`,
                transformOrigin: position === 'bottom-left' ? 'left center' : 'right center'
              }}
            >
              <ChatToggleButton 
                onClick={() => {}} 
                variant="default"
                size={scale < 0.75 ? 'sm' : scale > 1.25 ? 'lg' : 'default'}
              />
            </div>
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <h4 className={styles.settingsCardTitle}>Features</h4>
          </div>
          
          {Object.entries(features).map(([feature, enabled]) => (
            <div key={feature} className={styles.formRow}>
              <div className={styles.formRowLabel}>
                <span className={styles.label}>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <Switch 
                checked={enabled} 
                onCheckedChange={() => toggleFeature(feature as keyof typeof features)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatSettings;
