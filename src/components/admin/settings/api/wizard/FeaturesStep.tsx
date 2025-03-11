
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="space-y-4">
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
        <p className="text-xs text-muted-foreground">
          {ragPreference === 'supabase' 
            ? 'Basic RAG uses Supabase for simple vector storage' 
            : 'Advanced RAG uses Pinecone for high-performance vector search'}
        </p>
      </div>

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
        <p className="text-xs text-muted-foreground">
          {planningMode === 'basic' 
            ? 'Basic planning for simple projects' 
            : 'Advanced 01 reasoning for complex planning and decision making'}
        </p>
      </div>
    </div>
  );
}
