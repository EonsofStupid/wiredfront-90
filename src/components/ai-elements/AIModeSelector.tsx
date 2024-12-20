import { Bot, Code, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AIMode } from "@/types/ai";

interface AIModeSelectorProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

export const AIModeSelector = ({ mode, onModeChange }: AIModeSelectorProps) => {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as AIMode)} className="mb-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="code" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Code
        </TabsTrigger>
        <TabsTrigger value="file" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Files
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};