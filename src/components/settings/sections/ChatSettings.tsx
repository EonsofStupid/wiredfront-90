import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/components/chat/store/chatStore';
import { ArrowLeftRight, Pin, PinOff } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const ChatSettings = () => {
  const { position, togglePosition, docked, toggleDocked, scale, setScale } = useChatStore();
  const [activeTab, setActiveTab] = useState("features");

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Chat Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure your chat experience and appearance.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4">
            <h3 className="text-sm font-medium">Position & Behavior</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="position">Position</Label>
                <p className="text-sm text-muted-foreground">
                  Current position: {position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={togglePosition}
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Toggle Position
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="docked">Docked Mode</Label>
                <p className="text-sm text-muted-foreground">
                  {docked ? 'Chat is fixed in position' : 'Chat is freely draggable'}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={toggleDocked}
                className="flex items-center gap-2"
              >
                {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                {docked ? 'Undock' : 'Dock'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <h3 className="text-sm font-medium">Size</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="scale">Scale</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the size of the chat window
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                >
                  +
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default ChatSettings; 