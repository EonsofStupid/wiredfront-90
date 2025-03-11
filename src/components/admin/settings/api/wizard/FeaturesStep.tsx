
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Database, FileText, Layers, Sparkles, BookOpenCheck, GitFork, Construction } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface FeaturesStepProps {
  ragPreference: string;
  onRagPreferenceChange: (value: string) => void;
  planningMode: string;
  onPlanningModeChange: (value: string) => void;
}

export function FeaturesStep({
  ragPreference,
  onRagPreferenceChange,
  planningMode,
  onPlanningModeChange
}: FeaturesStepProps) {
  return (
    <div className="space-y-6">
      {/* RAG Preferences */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            <Database className="h-4 w-4 mr-2 text-indigo-400" />
            RAG Preference
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-slate-800 p-1 cursor-help">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select your preferred vectorstore for RAG operations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Choose which vector store to use for retrieval-augmented generation
        </p>
        
        <RadioGroup 
          value={ragPreference} 
          onValueChange={onRagPreferenceChange}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2 border border-gray-800 p-3 rounded-md bg-slate-900/30 hover:bg-slate-800/30 cursor-pointer">
            <RadioGroupItem value="supabase" id="r1" />
            <Label htmlFor="r1" className="flex-1 flex items-center cursor-pointer">
              <div className="ml-2">
                <p className="font-medium">Supabase</p>
                <p className="text-xs text-muted-foreground">Use Supabase pgvector for document retrieval</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-800 p-3 rounded-md bg-slate-900/30 hover:bg-slate-800/30 cursor-pointer">
            <RadioGroupItem value="pinecone" id="r2" />
            <Label htmlFor="r2" className="flex-1 flex items-center cursor-pointer">
              <div className="ml-2">
                <p className="font-medium">Pinecone</p>
                <p className="text-xs text-muted-foreground">Use Pinecone vector database for document retrieval</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Planning Mode */}
      <div className="space-y-3 pt-3 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            <Layers className="h-4 w-4 mr-2 text-indigo-400" />
            Planning Mode
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-slate-800 p-1 cursor-help">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the planning complexity for AI operations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Configure the reasoning approach for complex operations
        </p>
        
        <RadioGroup 
          value={planningMode} 
          onValueChange={onPlanningModeChange}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2 border border-gray-800 p-3 rounded-md bg-slate-900/30 hover:bg-slate-800/30 cursor-pointer">
            <RadioGroupItem value="basic" id="p1" />
            <Label htmlFor="p1" className="flex-1 flex items-center cursor-pointer">
              <BookOpenCheck className="h-4 w-4 text-gray-400 mr-2" />
              <div className="ml-2">
                <p className="font-medium">Basic</p>
                <p className="text-xs text-muted-foreground">Simple planning for straightforward tasks</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-800 p-3 rounded-md bg-slate-900/30 hover:bg-slate-800/30 cursor-pointer">
            <RadioGroupItem value="advanced" id="p2" />
            <Label htmlFor="p2" className="flex-1 flex items-center cursor-pointer">
              <GitFork className="h-4 w-4 text-gray-400 mr-2" />
              <div className="ml-2">
                <p className="font-medium">Advanced</p>
                <p className="text-xs text-muted-foreground">Multi-step reasoning for complex tasks</p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-800 p-3 rounded-md bg-slate-900/30 hover:bg-slate-800/30 cursor-pointer">
            <RadioGroupItem value="expert" id="p3" />
            <Label htmlFor="p3" className="flex-1 flex items-center cursor-pointer">
              <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
              <div className="ml-2">
                <p className="font-medium">Expert</p>
                <p className="text-xs text-muted-foreground">Complex chain-of-thought reasoning with verification</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
