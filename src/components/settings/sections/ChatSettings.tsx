import React, { useState, useEffect } from "react";
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

export function ChatSettings() {
  const { 
    position, 
    togglePosition, 
    isOpen, 
    isMinimized,
    toggleChat,
    currentMode,
    setCurrentMode,
    features,
    toggleFeature
  } = useChatStore();
  
  const [settings, setSettings] = useState({
    appearance: {
      position: typeof position === 'string' ? position : 'bottom-right',
      buttonColor: '#0EA5E9',
      buttonSize: 'medium',
      chatWidth: 400,
      chatHeight: 500,
    },
    behavior: {
      startMinimized: false,
      showTimestamps: true,
      saveHistory: true,
      autoComplete: true,
      darkMode: true,
    },
    notifications: {
      soundEnabled: true,
      desktopNotifications: false,
    },
    providers: {
      defaultProvider: 'openai',
      defaultModel: 'gpt-3.5-turbo',
    }
  });

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        position: typeof position === 'string' ? position : 'bottom-right',
      }
    }));
  }, [position]);

  const handlePositionChange = (newPosition: string) => {
    if (newPosition !== settings.appearance.position) {
      setSettings(prev => ({
        ...prev,
        appearance: {
          ...prev.appearance,
          position: newPosition as "bottom-right" | "bottom-left",
        }
      }));
      
      if ((typeof position === 'string' && position !== newPosition) ||
          (typeof position !== 'string')) {
        togglePosition();
      }
    }
  };

  const handleSaveSettings = () => {
    if (typeof position === 'string' && position !== settings.appearance.position) {
      togglePosition();
    }
    
    document.documentElement.style.setProperty('--chat-width', `${settings.appearance.chatWidth}px`);
    document.documentElement.style.setProperty('--chat-height', `${settings.appearance.chatHeight}px`);
    
    toast.success("Chat settings saved successfully");
  };

  const handleFeatureToggle = (feature: string) => {
    toggleFeature(feature as any);
  };

  const handleResetDefaults = () => {
    setSettings({
      appearance: {
        position: 'bottom-right',
        buttonColor: '#0EA5E9',
        buttonSize: 'medium',
        chatWidth: 400,
        chatHeight: 500,
      },
      behavior: {
        startMinimized: false,
        showTimestamps: true,
        saveHistory: true,
        autoComplete: true,
        darkMode: true,
      },
      notifications: {
        soundEnabled: true,
        desktopNotifications: false,
      },
      providers: {
        defaultProvider: 'openai',
        defaultModel: 'gpt-3.5-turbo',
      }
    });
    
    toast.info("Settings reset to defaults");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
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
            <Label>Chat Size</Label>
            <div className={styles.formRow}>
              <span>Width</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="300"
                  max="600"
                  value={settings.appearance.chatWidth}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      chatWidth: parseInt(e.target.value),
                    }
                  }))}
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
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      chatHeight: parseInt(e.target.value),
                    }
                  }))}
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
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                behavior: {
                  ...prev.behavior,
                  startMinimized: checked,
                }
              }))}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Show Timestamps</span>
              <span className={styles.description}>Display time for each message</span>
            </div>
            <Switch 
              checked={settings.behavior.showTimestamps} 
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                behavior: {
                  ...prev.behavior,
                  showTimestamps: checked,
                }
              }))}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formRowLabel}>
              <span className={styles.label}>Save History</span>
              <span className={styles.description}>Persist chat history between sessions</span>
            </div>
            <Switch 
              checked={settings.behavior.saveHistory} 
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                behavior: {
                  ...prev.behavior,
                  saveHistory: checked,
                }
              }))}
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
              onValueChange={(value) => setSettings(prev => ({
                ...prev,
                providers: {
                  ...prev.providers,
                  defaultProvider: value,
                }
              }))}
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
              onValueChange={(value) => setSettings(prev => ({
                ...prev,
                providers: {
                  ...prev.providers,
                  defaultModel: value,
                }
              }))}
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
