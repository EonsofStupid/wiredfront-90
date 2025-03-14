
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Mobile-optimized settings screen with grouped options
 */
export const MobileSettings = () => {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="appearance" className="border-neon-blue/20">
          <AccordionTrigger className="text-neon-pink hover:text-neon-blue">
            Appearance
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                <Switch id="dark-mode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm">Animations</Label>
                <Switch id="animations" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-view" className="text-sm">Compact View</Label>
                <Switch id="compact-view" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="notifications" className="border-neon-blue/20">
          <AccordionTrigger className="text-neon-pink hover:text-neon-blue">
            Notifications
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-sm">Sound</Label>
                <Switch id="sound" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="updates" className="text-sm">App Updates</Label>
                <Switch id="updates" defaultChecked />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ai-settings" className="border-neon-blue/20">
          <AccordionTrigger className="text-neon-pink hover:text-neon-blue">
            AI Assistant
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-suggestions" className="text-sm">AI Suggestions</Label>
                <Switch id="ai-suggestions" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="code-completion" className="text-sm">Code Completion</Label>
                <Switch id="code-completion" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="data-collection" className="text-sm">Data Collection</Label>
                <Switch id="data-collection" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="text-center text-xs text-neon-pink/60 pt-4">
        <p>wiredFRONT Mobile v1.0.0</p>
        <p>© 2023 wiredFRONT Technologies</p>
      </div>
    </div>
  );
};
