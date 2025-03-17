
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useEditorMode } from "@/components/editor/providers/EditorModeProvider";
import { DevModeTab } from "./tabs/DevModeTab";
import { PlanningModeTab } from "./tabs/PlanningModeTab";
import { HistoryModeTab } from "./tabs/HistoryModeTab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from '../../store';
import { Save, Folder, FileCode2, PanelRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EditorChatModuleProps {
  className?: string;
}

export function EditorChatModule({ className }: EditorChatModuleProps) {
  const { currentFiles, activeFile } = useEditorMode();
  const [activeTab, setActiveTab] = useState<'dev' | 'planning' | 'history'>('dev');
  const { isMinimized } = useChatStore();

  // Don't render content if minimized
  if (isMinimized) {
    return null;
  }

  return (
    <div className={`editor-chat-module ${className || ''}`}>
      <Tabs 
        defaultValue="dev" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full bg-background/10 rounded">
          <TabsTrigger value="dev" className="text-xs">
            Dev
          </TabsTrigger>
          <TabsTrigger value="planning" className="text-xs">
            Planning
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            History
          </TabsTrigger>
        </TabsList>

        <Card className="mt-2 bg-background/10 border-none text-white p-0">
          <div className="p-2 border-b border-white/10 flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-neon-blue" />
            <span className="text-xs font-medium truncate">
              {activeFile || 'No active file'}
            </span>
            {activeFile && (
              <Badge variant="outline" className="ml-auto text-[9px] h-4 bg-neon-blue/10">
                Active
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[350px] editor-chat-content p-2">
            <TabsContent value="dev" className="mt-0">
              <DevModeTab 
                activeFile={activeFile} 
                fileContent={activeFile ? currentFiles[activeFile] : ''} 
              />
            </TabsContent>
            
            <TabsContent value="planning" className="mt-0">
              <PlanningModeTab 
                files={Object.keys(currentFiles)} 
                onSelectFile={() => {}} 
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <HistoryModeTab />
            </TabsContent>
          </ScrollArea>
        </Card>
      </Tabs>
    </div>
  );
}
