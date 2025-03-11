
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Database, Cpu } from "lucide-react";

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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-medium">RAG Storage Configuration</h3>
        </div>
        
        <Card className="p-4 bg-muted/30">
          <div className="space-y-2">
            <Label htmlFor="ragPreference">RAG Storage Preference</Label>
            <Select value={ragPreference} onValueChange={onRagPreferenceChange}>
              <SelectTrigger id="ragPreference">
                <SelectValue placeholder="Select RAG storage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase">Supabase (Basic)</SelectItem>
                <SelectItem value="pinecone">Pinecone (Advanced)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {ragPreference === 'supabase' 
                ? 'Basic RAG uses Supabase for simple vector storage and retrieval.' 
                : 'Advanced RAG uses Pinecone for high-performance vector search with better semantic matching.'}
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Planning Configuration</h3>
        </div>
        
        <Card className="p-4 bg-muted/30">
          <div className="space-y-2">
            <Label htmlFor="planningMode">Planning Mode</Label>
            <Select value={planningMode} onValueChange={onPlanningModeChange}>
              <SelectTrigger id="planningMode">
                <SelectValue placeholder="Select planning mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced (01 Reasoning)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {planningMode === 'basic' 
                ? 'Basic planning for simple projects and straightforward tasks.' 
                : 'Advanced 01 reasoning for complex planning with multi-step decision making.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
