
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Plus, FileCode, CheckCircle, X } from 'lucide-react';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PlanningModeTabProps {
  files: string[];
  onSelectFile: (file: string) => void;
}

export function PlanningModeTab({ files, onSelectFile }: PlanningModeTabProps) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');
  const { sendMessage, isLoading } = useMessageAPI();

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()]);
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const toggleFileSelection = (file: string) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter(f => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleCreatePlan = () => {
    if (!taskName.trim()) return;
    
    const planMessage = `
# Task Planning: ${taskName}

${taskDescription}

## Files Involved:
${selectedFiles.map(file => `- ${file}`).join('\n')}

## Steps to Complete:
${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Please help me implement this plan efficiently.
    `.trim();
    
    sendMessage(planMessage);
  };

  return (
    <div className="planning-mode-tab space-y-3">
      <div className="text-xs text-white/70 mb-2">
        Create a development plan to tackle complex tasks with proper context.
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-white/80 mb-1 block">Task Name</label>
          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Implement authentication"
            className="bg-black/20 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/80 mb-1 block">Task Description</label>
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe what you need to accomplish..."
            className="min-h-16 bg-black/20 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="files" className="border-white/10">
            <AccordionTrigger className="text-xs font-medium text-white/80 py-1">
              Related Files ({selectedFiles.length})
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {files.map(file => (
                    <div 
                      key={file} 
                      className="flex items-center gap-2 p-1 rounded hover:bg-white/5 cursor-pointer"
                      onClick={() => toggleFileSelection(file)}
                    >
                      <div className={`h-3 w-3 rounded-sm flex items-center justify-center ${
                        selectedFiles.includes(file) ? 'bg-chat-neon-blue' : 'border border-white/30'
                      }`}>
                        {selectedFiles.includes(file) && <CheckCircle className="h-2 w-2 text-black" />}
                      </div>
                      <FileCode className="h-3 w-3 text-white/60" />
                      <span className="text-xs text-white/70 truncate">{file}</span>
                    </div>
                  ))}
                  {files.length === 0 && (
                    <div className="text-xs text-white/50 p-1">No files available</div>
                  )}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <label className="text-xs font-medium text-white/80 mb-1 flex justify-between items-center">
            <span>Implementation Steps ({steps.length})</span>
          </label>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="bg-chat-neon-blue/10 text-white/80 rounded-full h-5 w-5 flex items-center justify-center text-[10px] mt-1">
                  {index + 1}
                </div>
                <div className="flex-1 text-xs text-white/80 bg-black/20 p-2 rounded">
                  {step}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5 text-white/50 hover:text-white hover:bg-red-500/20 mt-1" 
                  onClick={() => removeStep(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <div className="flex gap-2 items-center">
              <div className="bg-chat-neon-blue/10 text-white/80 rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
                {steps.length + 1}
              </div>
              <Input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStep()}
                placeholder="Add implementation step..."
                className="flex-1 h-8 bg-black/20 border-white/10 text-white placeholder:text-white/40"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" 
                onClick={addStep}
                disabled={!newStep.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-chat-neon-blue hover:bg-chat-neon-blue/80 text-xs"
          onClick={handleCreatePlan}
          disabled={isLoading || !taskName.trim() || steps.length === 0}
        >
          Create Planning Session
        </Button>
      </div>
    </div>
  );
}
