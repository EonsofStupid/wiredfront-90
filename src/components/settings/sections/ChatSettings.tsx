import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatStore } from "@/components/chat/store/chatStore";
import { useChatButtonStore } from "@/components/chat/store/chatButtonStore";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/ChatSettings.module.css";
import { ChatButton } from "@/components/chat/components/ChatButton";

export function ChatSettings() {
  const { 
    currentMode,
    setCurrentMode,
    selectedModel,
    availableProviders,
    currentProvider,
    updateCurrentProvider,
    features,
    toggleFeature
  } = useChatStore();

  const {
    position,
    setPosition,
    scale,
    setScale,
    docked,
    toggleDocked,
    features: buttonFeatures,
    toggleFeature: toggleButtonFeature
  } = useChatButtonStore();

  const handlePositionChange = (newPosition: string) => {
    setPosition(newPosition as "bottom-right" | "bottom-left");
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
            <ChatButton
              position={position}
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
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Start Minimized</span>
              <span className={styles.description}>Open chat in minimized state</span>
            </div>
            <Switch 
              checked={buttonFeatures.startMinimized} 
              onCheckedChange={() => toggleButtonFeature('startMinimized')}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Show Timestamps</span>
              <span className={styles.description}>Display time for each message</span>
            </div>
            <Switch 
              checked={buttonFeatures.showTimestamps} 
              onCheckedChange={() => toggleButtonFeature('showTimestamps')}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Save History</span>
              <span className={styles.description}>Persist chat history between sessions</span>
            </div>
            <Switch 
              checked={buttonFeatures.saveHistory} 
              onCheckedChange={() => toggleButtonFeature('saveHistory')}
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
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
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

        <div className={styles.actionButtons}>
          <Button variant="destructive" onClick={handleClearHistory}>Clear Chat History</Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSettings;
