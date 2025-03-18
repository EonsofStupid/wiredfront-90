
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChatUIStore } from '@/stores/chat-ui';

const CyberpunkSettingsPanel: React.FC = () => {
  const { 
    theme, 
    isGlassEffect, 
    keyboardShortcutsEnabled,
    quickActionsVisible,
    scale,
    setTheme,
    toggleGlassEffect,
    toggleKeyboardShortcuts,
    toggleQuickActions,
    setScale
  } = useChatUIStore();

  return (
    <div className="chat-cyberpunk-settings-panel">
      <div className="chat-cyberpunk-settings-section">
        <h3 className="chat-cyberpunk-settings-title">Theme</h3>
        <RadioGroup 
          value={theme} 
          onValueChange={(value) => setTheme(value as any)}
          className="chat-cyberpunk-settings-radio"
        >
          <div className="chat-cyberpunk-settings-radio-item">
            <RadioGroupItem value="cyberpunk" id="theme-cyberpunk" />
            <Label htmlFor="theme-cyberpunk">Cyberpunk</Label>
          </div>
          
          <div className="chat-cyberpunk-settings-radio-item">
            <RadioGroupItem value="minimal" id="theme-minimal" />
            <Label htmlFor="theme-minimal">Minimal</Label>
          </div>
          
          <div className="chat-cyberpunk-settings-radio-item">
            <RadioGroupItem value="classic" id="theme-classic" />
            <Label htmlFor="theme-classic">Classic</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="chat-cyberpunk-settings-section">
        <h3 className="chat-cyberpunk-settings-title">Appearance</h3>
        
        <div className="chat-cyberpunk-settings-item">
          <div className="chat-cyberpunk-settings-item-label">
            <Label htmlFor="glass-effect">Glass effect</Label>
            <span className="chat-cyberpunk-settings-item-description">
              Enable transparent glass effect
            </span>
          </div>
          <Switch 
            id="glass-effect" 
            checked={isGlassEffect} 
            onCheckedChange={toggleGlassEffect} 
          />
        </div>
        
        <div className="chat-cyberpunk-settings-item">
          <div className="chat-cyberpunk-settings-item-label">
            <Label>Chat scale</Label>
            <span className="chat-cyberpunk-settings-item-description">
              Adjust the size of the chat interface
            </span>
          </div>
          <Slider
            defaultValue={[scale]}
            max={1.5}
            min={0.7}
            step={0.1}
            onValueChange={([value]) => setScale(value)}
            className="chat-cyberpunk-settings-slider"
          />
        </div>
      </div>
      
      <div className="chat-cyberpunk-settings-section">
        <h3 className="chat-cyberpunk-settings-title">Features</h3>
        
        <div className="chat-cyberpunk-settings-item">
          <div className="chat-cyberpunk-settings-item-label">
            <Label htmlFor="keyboard-shortcuts">Keyboard shortcuts</Label>
            <span className="chat-cyberpunk-settings-item-description">
              Enable keyboard navigation shortcuts
            </span>
          </div>
          <Switch 
            id="keyboard-shortcuts" 
            checked={keyboardShortcutsEnabled} 
            onCheckedChange={toggleKeyboardShortcuts} 
          />
        </div>
        
        <div className="chat-cyberpunk-settings-item">
          <div className="chat-cyberpunk-settings-item-label">
            <Label htmlFor="quick-actions">Quick actions</Label>
            <span className="chat-cyberpunk-settings-item-description">
              Show quick action buttons in chat
            </span>
          </div>
          <Switch 
            id="quick-actions" 
            checked={quickActionsVisible} 
            onCheckedChange={toggleQuickActions} 
          />
        </div>
      </div>
      
      <div className="chat-cyberpunk-settings-footer">
        <Button variant="outline" className="chat-cyberpunk-settings-reset" onClick={() => useChatUIStore.getState().resetUI()}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default CyberpunkSettingsPanel;
