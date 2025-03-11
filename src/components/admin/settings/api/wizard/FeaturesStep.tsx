
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Database, Server } from "lucide-react";

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
      <Tabs defaultValue="rag" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rag" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            RAG Configuration
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Planning Mode
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rag" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>RAG Storage Preference</Label>
            <RadioGroup 
              value={ragPreference} 
              onValueChange={onRagPreferenceChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 shadow-sm">
                <RadioGroupItem value="supabase" id="rag-supabase" />
                <Label htmlFor="rag-supabase" className="flex flex-1 items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Supabase Vector Store</p>
                    <p className="text-xs text-muted-foreground">
                      Suitable for small projects and starter use cases
                    </p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 shadow-sm">
                <RadioGroupItem value="pinecone" id="rag-pinecone" />
                <Label htmlFor="rag-pinecone" className="flex flex-1 items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Pinecone Vector DB</p>
                    <p className="text-xs text-muted-foreground">
                      Advanced vector storage for large-scale applications
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="planning" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Planning Mode</Label>
            <Select value={planningMode} onValueChange={onPlanningModeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select planning mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">
                  Basic Planning
                </SelectItem>
                <SelectItem value="advanced">
                  Advanced Planning
                </SelectItem>
                <SelectItem value="reasoning">
                  01 Logic Reasoning
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {planningMode === 'basic' && "Simple step-by-step planning suitable for most tasks"}
              {planningMode === 'advanced' && "Detailed planning with file interdependency analysis"}
              {planningMode === 'reasoning' && "Advanced reasoning with deep architecture analysis"}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
