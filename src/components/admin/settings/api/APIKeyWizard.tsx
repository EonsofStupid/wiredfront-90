
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Info, Key, ArrowRight } from "lucide-react";
import { APIType } from "@/types/admin/settings/api";

interface APIKeyWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: APIType, name: string, key: string, settings: any, roles: string[], users: string[]) => Promise<boolean>;
  isSubmitting: boolean;
}

export function APIKeyWizard({ open, onOpenChange, onSave, isSubmitting }: APIKeyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<APIType>("openai");
  const [newKey, setNewKey] = useState({ name: "", key: "", provider: "openai" as APIType });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [ragPreference, setRagPreference] = useState("supabase");
  const [planningMode, setPlanningMode] = useState("basic");

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedProvider("openai");
    setNewKey({ name: "", key: "", provider: "openai" });
    setSelectedRoles([]);
    setSelectedFeatures([]);
    setRagPreference("supabase");
    setPlanningMode("basic");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!newKey.name || !newKey.key) {
      return;
    }

    const result = await onSave(
      selectedProvider,
      newKey.name,
      newKey.key,
      {
        feature_bindings: selectedFeatures,
        rag_preference: ragPreference,
        planning_mode: planningMode
      },
      selectedRoles,
      []
    );

    if (result) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Enter your API key information"}
            {currentStep === 2 && "Configure key permissions and assignments"}
            {currentStep === 3 && "Set up RAG and planning preferences"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-5">
            <Progress className="h-2" value={(currentStep / 3) * 100} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span className={currentStep >= 1 ? "text-primary" : ""}>Key Details</span>
              <span className={currentStep >= 2 ? "text-primary" : ""}>Permissions</span>
              <span className={currentStep >= 3 ? "text-primary" : ""}>Features</span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiProvider">API Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger id="apiProvider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="pinecone">Pinecone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memorableName">Memorable Name</Label>
                <Input
                  id="memorableName"
                  value={newKey.name}
                  onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                  placeholder="e.g., production_main_key"
                />
                <p className="text-xs text-muted-foreground">
                  Give this key a memorable name for easy reference
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  placeholder={
                    selectedProvider === 'openai' ? 'sk-...' :
                    selectedProvider === 'anthropic' ? 'sk-ant-...' :
                    selectedProvider === 'gemini' ? 'AIza...' :
                    selectedProvider === 'pinecone' ? 'PINE-...' :
                    'Enter your API key'
                  }
                />
                <p className="text-xs text-muted-foreground flex items-center">
                  <Info className="h-3 w-3 mr-1" /> 
                  This key will be encrypted and stored securely
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role Assignments</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['super_admin', 'admin', 'developer', 'user'].map(role => (
                    <div className="flex items-center space-x-2" key={role}>
                      <Switch
                        id={`role-${role}`}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRoles([...selectedRoles, role]);
                          } else {
                            setSelectedRoles(selectedRoles.filter(r => r !== role));
                          }
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize">
                        {role.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select which roles will have access to this API key
                </p>
              </div>

              <div className="space-y-2">
                <Label>Feature Bindings</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['chat', 'document_generation', 'code_analysis', 'rag'].map(feature => (
                    <div className="flex items-center space-x-2" key={feature}>
                      <Switch
                        id={`feature-${feature}`}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                      <Label htmlFor={`feature-${feature}`} className="capitalize">
                        {feature.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select which features will use this API key
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ragPreference">RAG Storage Preference</Label>
                <Select value={ragPreference} onValueChange={setRagPreference}>
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
                <Select value={planningMode} onValueChange={setPlanningMode}>
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
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            )}
            <Button onClick={nextStep} disabled={isSubmitting}>
              {currentStep < 3 ? (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {isSubmitting ? "Saving..." : "Save API Key"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
