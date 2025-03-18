
import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DockPosition, DockItem } from '@/stores/chat-ui/types';
import { useChatUIStore } from '@/stores/chat-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CyberpunkMemoryPanel from '../features/memory/CyberpunkMemoryPanel';
import CyberpunkFilesPanel from '../features/files/CyberpunkFilesPanel';
import CyberpunkCommandsPanel from '../features/commands/CyberpunkCommandsPanel';
import CyberpunkSettingsPanel from '../features/settings/CyberpunkSettingsPanel';
import CyberpunkWorkflowPanel from '../features/workflow/CyberpunkWorkflowPanel';

interface CyberpunkDockPanelProps {
  position: DockPosition;
  items: DockItem[];
  activeItem: DockItem | null;
}

const CyberpunkDockPanel: React.FC<CyberpunkDockPanelProps> = ({
  position,
  items,
  activeItem
}) => {
  const { 
    toggleDockVisibility, 
    setDockPosition, 
    setActiveDockItem, 
    removeDockItem 
  } = useChatUIStore();
  
  // Display name mapping for items
  const itemNames: Record<DockItem, string> = {
    memory: 'Memory',
    files: 'Files',
    commands: 'Commands',
    workflow: 'Workflow',
    settings: 'Settings'
  };
  
  // Icon mapping for position buttons
  const positionIcons = {
    left: <ArrowLeft className="h-4 w-4" />,
    right: <ArrowRight className="h-4 w-4" />,
    bottom: <ArrowDown className="h-4 w-4" />
  };
  
  // Create dock position class
  const dockPositionClass = `chat-cyberpunk-dock-panel chat-cyberpunk-dock-${position}`;
  
  // Available positions excluding current
  const availablePositions = Object.keys(positionIcons).filter(
    p => p !== position
  ) as DockPosition[];

  return (
    <div className={dockPositionClass}>
      <div className="chat-cyberpunk-dock-header">
        <div className="chat-cyberpunk-dock-title">
          {activeItem && itemNames[activeItem]}
        </div>
        
        <div className="chat-cyberpunk-dock-controls">
          {availablePositions.map(pos => (
            <Button
              key={pos}
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-dock-control-button"
              onClick={() => setDockPosition(pos)}
              aria-label={`Move to ${pos}`}
            >
              {positionIcons[pos]}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="icon"
            className="chat-cyberpunk-dock-control-button"
            onClick={toggleDockVisibility}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeItem || items[0]} 
        onValueChange={(value) => setActiveDockItem(value as DockItem)}
        className="chat-cyberpunk-dock-tabs"
      >
        <TabsList className="chat-cyberpunk-dock-tabs-list">
          {items.map(item => (
            <TabsTrigger 
              key={item} 
              value={item}
              className="chat-cyberpunk-dock-tab"
            >
              {itemNames[item]}
              
              <Button
                variant="ghost"
                size="icon"
                className="chat-cyberpunk-dock-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  removeDockItem(item);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="chat-cyberpunk-dock-content">
          <TabsContent value="memory" className="chat-cyberpunk-dock-tab-content">
            <CyberpunkMemoryPanel />
          </TabsContent>
          
          <TabsContent value="files" className="chat-cyberpunk-dock-tab-content">
            <CyberpunkFilesPanel />
          </TabsContent>
          
          <TabsContent value="commands" className="chat-cyberpunk-dock-tab-content">
            <CyberpunkCommandsPanel />
          </TabsContent>
          
          <TabsContent value="workflow" className="chat-cyberpunk-dock-tab-content">
            <CyberpunkWorkflowPanel />
          </TabsContent>
          
          <TabsContent value="settings" className="chat-cyberpunk-dock-tab-content">
            <CyberpunkSettingsPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CyberpunkDockPanel;
