import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatStore } from "@/components/chat/store/chatStore";
import { useSettingsStore } from "@/stores/settings";
import { Check, MessageCircle, Zap, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/ChatSettings.module.css";
import { buttonStyles } from "@/constants/chat/button-styles.tsx";
import { ButtonStyle } from "@/types/chat/button-styles";

export function ChatSettings() {
  const { 
    settings,
    updateSettings,
    resetSettings,
    position,
    togglePosition,
    features,
    toggleFeature
  } = useChatStore();

  const handlePositionChange = (newPosition: string) => {
    if (newPosition !== settings.appearance.position) {
      updateSettings({
        appearance: {
          ...settings.appearance,
          position: newPosition as "bottom-right" | "bottom-left",
        }
      });
      
      if (position !== newPosition) {
        togglePosition();
      }
    }
  };

  const handleSaveSettings = () => {
    // Apply position settings if needed
    if (position !== settings.appearance.position) {
      togglePosition();
    }
    
    // Update CSS variables for chat appearance
    document.documentElement.style.setProperty('--chat-width', `${settings.appearance.chatWidth}px`);
    document.documentElement.style.setProperty('--chat-height', `${settings.appearance.chatHeight}px`);
    
    toast.success("Chat settings saved successfully");
  };

  const handleFeatureToggle = (feature: string) => {
    toggleFeature(feature as keyof typeof features);
  };

  const handleResetDefaults = () => {
    resetSettings();
    toast.info("Settings reset to defaults");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      // Here we would clear chat history
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
                className={`${styles.positionOption} ${settings.appearance.position === 'bottom-left' ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('bottom-left')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionLeft}`}></div>
                Bottom Left
              </div>
              <div 
                className={`${styles.positionOption} ${settings.appearance.position === 'bottom-right' ? styles.positionOptionSelected : ''}`}
                onClick={() => handlePositionChange('bottom-right')}
              >
                <div className={`${styles.positionOptionIndicator} ${styles.positionOptionRight}`}></div>
                Bottom Right
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Button Style</Label>
            <div className={styles.styleOptions}>
              {Object.entries(buttonStyles).map(([key, style]) => {
                const buttonStyle = style as ButtonStyle;
                return (
                  <div
                    key={key}
                    className={`${styles.styleOption} ${settings.appearance.buttonStyle === key ? styles.styleOptionSelected : ''}`}
                    onClick={() => updateSettings({
                      appearance: {
                        ...settings.appearance,
                        buttonStyle: key
                      }
                    })}
                  >
                    <div 
                      className={styles.stylePreview} 
                      style={{
                        background: buttonStyle.theme.background,
                        border: buttonStyle.theme.border,
                        boxShadow: buttonStyle.theme.glow,
                        color: buttonStyle.theme.primary
                      }}
                    >
                      {buttonStyle.icon.default}
                    </div>
                    <span>{buttonStyle.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Button Size</Label>
            <div className={styles.sizeOptions}>
              {['small', 'medium', 'large'].map(size => (
                <div
                  key={size}
                  className={`${styles.sizeOption} ${settings.appearance.buttonSize === size ? styles.sizeOptionSelected : ''}`}
                  onClick={() => updateSettings({
                    appearance: {
                      ...settings.appearance,
                      buttonSize: size as 'small' | 'medium' | 'large'
                    }
                  })}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label>Chat Size</Label>
            <div className={styles.formRow}>
              <span>Width</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="300"
                  max="600"
                  value={settings.appearance.chatWidth}
                  onChange={(e) => updateSettings({
                    appearance: {
                      ...settings.appearance,
                      chatWidth: parseInt(e.target.value),
                    }
                  })}
                  className="w-32 mr-2"
                />
                <span>{settings.appearance.chatWidth}px</span>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <span>Height</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="400"
                  max="800"
                  value={settings.appearance.chatHeight}
                  onChange={(e) => updateSettings({
                    appearance: {
                      ...settings.appearance,
                      chatHeight: parseInt(e.target.value),
                    }
                  })}
                  className="w-32 mr-2"
                />
                <span>{settings.appearance.chatHeight}px</span>
              </div>
            </div>
          </div>

          <div className={styles.previewContainer}>
            <span className={styles.previewLabel}>Preview</span>
            <div 
              className={`${styles.previewButton} cyber-pulse-blue`} 
              style={{
                position: 'relative',
                [settings.appearance.position === 'bottom-left' ? 'left' : 'right']: '0',
              }}
            >
              <Zap className="h-4 w-4" />
            </div>
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
              checked={settings.behavior.startMinimized} 
              onCheckedChange={(checked) => updateSettings({
                behavior: {
                  ...settings.behavior,
                  startMinimized: checked,
                }
              })}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Show Timestamps</span>
              <span className={styles.description}>Display time for each message</span>
            </div>
            <Switch 
              checked={settings.behavior.showTimestamps} 
              onCheckedChange={(checked) => updateSettings({
                behavior: {
                  ...settings.behavior,
                  showTimestamps: checked,
                }
              })}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Save History</span>
              <span className={styles.description}>Persist chat history between sessions</span>
            </div>
            <Switch 
              checked={settings.behavior.saveHistory} 
              onCheckedChange={(checked) => updateSettings({
                behavior: {
                  ...settings.behavior,
                  saveHistory: checked,
                }
              })}
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
              value={settings.providers.defaultProvider}
              onValueChange={(value) => updateSettings({
                providers: {
                  ...settings.providers,
                  defaultProvider: value,
                }
              })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className={styles.formGroup}>
            <Label>Default Model</Label>
            <Select 
              value={settings.providers.defaultModel}
              onValueChange={(value) => updateSettings({
                providers: {
                  ...settings.providers,
                  defaultModel: value,
                }
              })}
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
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Voice Input</span>
              <span className={styles.description}>Enable voice input for chat</span>
            </div>
            <Switch 
              checked={features.voice} 
              onCheckedChange={() => handleFeatureToggle('voice')}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>RAG Support</span>
              <span className={styles.description}>Use retrieval augmented generation</span>
            </div>
            <Switch 
              checked={features.rag} 
              onCheckedChange={() => handleFeatureToggle('rag')}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Mode Switching</span>
              <span className={styles.description}>Allow switching between chat modes</span>
            </div>
            <Switch 
              checked={features.modeSwitch} 
              onCheckedChange={() => handleFeatureToggle('modeSwitch')}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>GitHub Integration</span>
              <span className={styles.description}>Connect with GitHub repositories</span>
            </div>
            <Switch 
              checked={features.github} 
              onCheckedChange={() => handleFeatureToggle('github')}
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
          <Button variant="outline" onClick={handleResetDefaults}>Reset to Defaults</Button>
          <Button variant="destructive" onClick={handleClearHistory}>Clear Chat History</Button>
        </div>
      </div>
    </div>
  );
}
