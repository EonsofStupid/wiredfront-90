
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChatToggleButton } from "@/components/chat/components/ChatToggleButton";
import { buttonStyles } from "@/constants/chat/button-styles";
import { getChatSettings, saveChatSettings, resetChatSettings, ChatSettings as ChatSettingsType } from "@/utils/storage/chat-settings";
import { ArrowLeftRight, RotateCcw, Palette, Save } from "lucide-react";
import { toast } from "sonner";
import styles from "../../styles/ChatSettings.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ChatSettings = () => {
  const [settings, setSettings] = useState<ChatSettingsType>(getChatSettings());
  const [activeTab, setActiveTab] = useState("appearance");
  const [buttonPreviewColor, setButtonPreviewColor] = useState(settings.appearance.buttonColor);
  const [previewSize, setPreviewSize] = useState(settings.appearance.buttonSize);
  const [previewStyle, setPreviewStyle] = useState(settings.appearance.buttonStyle);
  
  const handleTogglePosition = () => {
    const newPosition = settings.appearance.position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        position: newPosition
      }
    });
  };
  
  const handleReset = () => {
    resetChatSettings();
    setSettings(getChatSettings());
    setButtonPreviewColor(getChatSettings().appearance.buttonColor);
    setPreviewSize(getChatSettings().appearance.buttonSize);
    setPreviewStyle(getChatSettings().appearance.buttonStyle);
    toast.success("Chat settings reset to defaults");
  };
  
  const handleSave = () => {
    // Apply the preview values to the actual settings
    const updatedSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        buttonColor: buttonPreviewColor,
        buttonSize: previewSize,
        buttonStyle: previewStyle,
      }
    };
    
    setSettings(updatedSettings);
    saveChatSettings(updatedSettings);
    toast.success("Chat settings saved successfully");
  };
  
  return (
    <Card className="p-6">
      <div className={styles.settingsContainer}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Chat Settings</h2>
          <p className="text-muted-foreground mb-6">
            Configure the appearance and behavior of the chat interface.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-6">
            <div>
              <h3 className={styles.sectionTitle}>Button Position</h3>
              <p className={styles.sectionDescription}>
                Choose where the chat button should appear on the screen.
              </p>
              
              <div className={styles.positionOptions}>
                <div 
                  className={`${styles.positionOption} ${settings.appearance.position === 'bottom-left' ? styles.positionOptionSelected : ''}`}
                  onClick={() => setSettings({...settings, appearance: {...settings.appearance, position: 'bottom-left'}})}
                >
                  <div className={`${styles.positionOptionIndicator} ${styles.positionOptionLeft}`}></div>
                  Bottom Left
                </div>
                <div 
                  className={`${styles.positionOption} ${settings.appearance.position === 'bottom-right' ? styles.positionOptionSelected : ''}`}
                  onClick={() => setSettings({...settings, appearance: {...settings.appearance, position: 'bottom-right'}})}
                >
                  <div className={`${styles.positionOptionIndicator} ${styles.positionOptionRight}`}></div>
                  Bottom Right
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleTogglePosition}
                className="flex items-center gap-2 mt-4"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Toggle Position
              </Button>
            </div>
            
            <div>
              <h3 className={styles.sectionTitle}>Button Style</h3>
              <p className={styles.sectionDescription}>
                Choose a visual style for the chat button.
              </p>
              
              <div className={styles.styleOptions}>
                {Object.entries(buttonStyles).map(([key, style]) => (
                  <div
                    key={key}
                    className={`${styles.styleOption} ${previewStyle === key ? styles.styleOptionSelected : ''}`}
                    onClick={() => setPreviewStyle(key)}
                  >
                    <div 
                      className={styles.stylePreview}
                      style={{
                        background: style.theme.background,
                        border: style.theme.border,
                        boxShadow: style.theme.glow,
                      }}
                    >
                      <div className="h-6 w-6 text-white" dangerouslySetInnerHTML={{ __html: style.icon.default }} />
                    </div>
                    <span>{style.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className={styles.sectionTitle}>Button Color</h3>
              <p className={styles.sectionDescription}>
                Choose a color for the chat button (applies to some styles).
              </p>
              
              <div className={styles.colorPicker}>
                {['#0EA5E9', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                  <div
                    key={color}
                    className={`${styles.colorOption} ${buttonPreviewColor === color ? styles.colorOptionSelected : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setButtonPreviewColor(color)}
                  ></div>
                ))}
              </div>
              
              <Input 
                type="text" 
                value={buttonPreviewColor} 
                onChange={(e) => setButtonPreviewColor(e.target.value)}
                className="mt-4"
                placeholder="#0EA5E9"
              />
            </div>
            
            <div>
              <h3 className={styles.sectionTitle}>Button Size</h3>
              <p className={styles.sectionDescription}>
                Choose the size of the chat button.
              </p>
              
              <div className={styles.sizeOptions}>
                <div 
                  className={`${styles.sizeOption} ${previewSize === 'small' ? styles.sizeOptionSelected : ''}`}
                  onClick={() => setPreviewSize('small')}
                >
                  Small
                </div>
                <div 
                  className={`${styles.sizeOption} ${previewSize === 'medium' ? styles.sizeOptionSelected : ''}`}
                  onClick={() => setPreviewSize('medium')}
                >
                  Medium
                </div>
                <div 
                  className={`${styles.sizeOption} ${previewSize === 'large' ? styles.sizeOptionSelected : ''}`}
                  onClick={() => setPreviewSize('large')}
                >
                  Large
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={styles.sectionTitle}>Chat Window Size</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chatWidth">Width: {settings.appearance.chatWidth}px</Label>
                  <Slider
                    id="chatWidth"
                    min={320}
                    max={600}
                    step={10}
                    value={[settings.appearance.chatWidth]}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        chatWidth: value[0]
                      }
                    })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="chatHeight">Height: {settings.appearance.chatHeight}px</Label>
                  <Slider
                    id="chatHeight"
                    min={300}
                    max={800}
                    step={10}
                    value={[settings.appearance.chatHeight]}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        chatHeight: value[0]
                      }
                    })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.previewContainer}>
              <span className={styles.previewLabel}>Preview</span>
              <ChatToggleButton 
                className="static transform-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="behavior" className="space-y-6">
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="startMinimized">Start Minimized</Label>
                  <span className={styles.description}>Keep chat collapsed when page loads</span>
                </div>
                <Switch 
                  id="startMinimized" 
                  checked={settings.behavior.startMinimized}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    behavior: {
                      ...settings.behavior,
                      startMinimized: checked
                    }
                  })}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="showTimestamps">Show Timestamps</Label>
                  <span className={styles.description}>Display time each message was sent</span>
                </div>
                <Switch 
                  id="showTimestamps" 
                  checked={settings.behavior.showTimestamps}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    behavior: {
                      ...settings.behavior,
                      showTimestamps: checked
                    }
                  })}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="saveHistory">Save Chat History</Label>
                  <span className={styles.description}>Preserve conversations between sessions</span>
                </div>
                <Switch 
                  id="saveHistory" 
                  checked={settings.behavior.saveHistory}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    behavior: {
                      ...settings.behavior,
                      saveHistory: checked
                    }
                  })}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="autoComplete">Autocomplete</Label>
                  <span className={styles.description}>Enable suggestions as you type</span>
                </div>
                <Switch 
                  id="autoComplete" 
                  checked={settings.behavior.autoComplete}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    behavior: {
                      ...settings.behavior,
                      autoComplete: checked
                    }
                  })}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="darkMode">Dark Mode</Label>
                  <span className={styles.description}>Use dark theme for chat interface</span>
                </div>
                <Switch 
                  id="darkMode" 
                  checked={settings.behavior.darkMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    behavior: {
                      ...settings.behavior,
                      darkMode: checked
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="soundEnabled">Sound Notifications</Label>
                  <span className={styles.description}>Play sounds for new messages</span>
                </div>
                <Switch 
                  id="soundEnabled" 
                  checked={settings.notifications.soundEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      soundEnabled: checked
                    }
                  })}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formRowLabel}>
                  <Label className={styles.label} htmlFor="desktopNotifications">Desktop Notifications</Label>
                  <span className={styles.description}>Show notifications on your desktop</span>
                </div>
                <Switch 
                  id="desktopNotifications" 
                  checked={settings.notifications.desktopNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      desktopNotifications: checked
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className={styles.actionButtons}>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatSettings;
