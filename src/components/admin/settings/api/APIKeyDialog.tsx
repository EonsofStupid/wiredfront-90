
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Copy, 
  CheckCircle, 
  Key, 
  Info, 
  Zap, 
  Database, 
  MessageSquare,
  BrainCircuit
} from "lucide-react";
import { toast } from "sonner";
import { APIType } from "@/types/admin/settings/api-configuration";

interface APIKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyAdded: () => void;
}

export function APIKeyDialog({ isOpen, onClose, onKeyAdded }: APIKeyDialogProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiType, setApiType] = useState<APIType>('openai');
  const [memorableName, setMemorableName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [usageType, setUsageType] = useState('all');
  const [ragPreference, setRagPreference] = useState('supabase');
  const [planningMode, setPlanningMode] = useState('basic');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [keyCopied, setKeyCopied] = useState(false);

  const resetForm = () => {
    setStep(1);
    setApiType('openai');
    setMemorableName('');
    setApiKey('');
    setUsageType('all');
    setRagPreference('supabase');
    setPlanningMode('basic');
    setSavedApiKey('');
    setKeyCopied(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const nextStep = () => {
    if (step === 1 && (!apiType || !memorableName || !apiKey)) {
      toast.error("Please fill out all fields");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(savedApiKey);
    setKeyCopied(true);
    toast.success("API key copied to clipboard");
    
    setTimeout(() => {
      setKeyCopied(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Create configuration object with all settings
      const configSettings = {
        usage_type: usageType,
        rag_preference: ragPreference,
        planning_mode: planningMode,
        feature_bindings: []
      };

      if (usageType === 'chat') {
        configSettings.feature_bindings.push('chat');
      } else if (usageType === 'rag') {
        configSettings.feature_bindings.push('rag');
      } else if (usageType === 'planning') {
        configSettings.feature_bindings.push('planning');
      } else {
        configSettings.feature_bindings = ['chat', 'rag', 'planning'];
      }

      const result = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'create',
          provider: apiType,
          memorableName,
          secretValue: apiKey,
          settings: configSettings
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to save API key');
      }

      toast.success("API key saved successfully");
      setSavedApiKey(apiKey);
      setStep(3);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApiTypeLabel = (type: APIType) => {
    switch (type) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic (Claude)';
      case 'gemini':
        return 'Google Gemini';
      case 'huggingface':
        return 'HuggingFace';
      case 'pinecone':
        return 'Pinecone (Vector DB)';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            {step === 1 && "Add New API Key"}
            {step === 2 && "Configure Key Usage"}
            {step === 3 && "API Key Added Successfully"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter your API key details. This key will be securely stored and never displayed again."}
            {step === 2 && "Configure how this API key will be used in the system."}
            {step === 3 && "Your API key has been securely stored. Please save it now as it won't be displayed again."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="api-type">API Provider</Label>
              <Select 
                value={apiType} 
                onValueChange={(value) => setApiType(value as APIType)}
              >
                <SelectTrigger id="api-type">
                  <SelectValue placeholder="Select API provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="huggingface">HuggingFace</SelectItem>
                  <SelectItem value="pinecone">Pinecone Vector DB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memorable-name">Memorable Name</Label>
              <Input
                id="memorable-name"
                placeholder="e.g., OpenAI Production, Claude Testing"
                value={memorableName}
                onChange={(e) => setMemorableName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A friendly name to help you identify this key later
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                This key will be securely stored and never displayed again
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <Label>Key Usage</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={usageType === 'all' ? 'default' : 'outline'}
                  className={`h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${
                    usageType === 'all' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => setUsageType('all')}
                >
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-medium">All Features</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Use for all AI capabilities
                  </span>
                </Button>
                
                <Button
                  type="button"
                  variant={usageType === 'chat' ? 'default' : 'outline'}
                  className={`h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${
                    usageType === 'chat' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => setUsageType('chat')}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Chat Only</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Use for chatbot features
                  </span>
                </Button>
                
                <Button
                  type="button"
                  variant={usageType === 'rag' ? 'default' : 'outline'}
                  className={`h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${
                    usageType === 'rag' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => setUsageType('rag')}
                >
                  <Database className="h-5 w-5" />
                  <span className="text-sm font-medium">RAG Only</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Use for document retrieval
                  </span>
                </Button>
                
                <Button
                  type="button"
                  variant={usageType === 'planning' ? 'default' : 'outline'}
                  className={`h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${
                    usageType === 'planning' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => setUsageType('planning')}
                >
                  <BrainCircuit className="h-5 w-5" />
                  <span className="text-sm font-medium">Planning Only</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Use for code planning
                  </span>
                </Button>
              </div>
            </div>
            
            {(usageType === 'all' || usageType === 'rag') && (
              <div className="space-y-2">
                <Label htmlFor="rag-preference">RAG Preference</Label>
                <Select 
                  value={ragPreference} 
                  onValueChange={setRagPreference}
                >
                  <SelectTrigger id="rag-preference">
                    <SelectValue placeholder="Select RAG preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase (Standard)</SelectItem>
                    <SelectItem value="pinecone">Pinecone (Premium)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Standard uses Supabase for basic indexing, Premium uses Pinecone for deep indexing
                </p>
              </div>
            )}
            
            {(usageType === 'all' || usageType === 'planning') && (
              <div className="space-y-2">
                <Label htmlFor="planning-mode">Planning Mode</Label>
                <Select 
                  value={planningMode} 
                  onValueChange={setPlanningMode}
                >
                  <SelectTrigger id="planning-mode">
                    <SelectValue placeholder="Select planning mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Planning</SelectItem>
                    <SelectItem value="detailed">Detailed Planning</SelectItem>
                    <SelectItem value="architectural">Architectural Planning</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Determines the depth of planning for code generation and architectural decisions
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                This is the only time your API key will be displayed. Please copy it now if you need to keep a backup.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="saved-api-key">Your API Key</Label>
              <div className="flex">
                <Input
                  id="saved-api-key"
                  value={savedApiKey}
                  readOnly
                  className="rounded-r-none font-mono text-xs pr-2"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-l-none border-l-0"
                  onClick={copyToClipboard}
                >
                  {keyCopied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium">Key Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">Provider</div>
                  <div className="font-medium">{getApiTypeLabel(apiType)}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">Name</div>
                  <div className="font-medium">{memorableName}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">Usage</div>
                  <div className="font-medium capitalize">{usageType === 'all' ? 'All Features' : `${usageType} Only`}</div>
                </div>
                {(usageType === 'all' || usageType === 'rag') && (
                  <div className="p-2 bg-muted/30 rounded-md">
                    <div className="text-xs text-muted-foreground">RAG Preference</div>
                    <div className="font-medium capitalize">{ragPreference}</div>
                  </div>
                )}
                {(usageType === 'all' || usageType === 'planning') && (
                  <div className="p-2 bg-muted/30 rounded-md">
                    <div className="text-xs text-muted-foreground">Planning Mode</div>
                    <div className="font-medium capitalize">{planningMode}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {step === 1 && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button 
                type="button"

                onClick={nextStep}
                disabled={!apiType || !memorableName || !apiKey}
              >
                Continue
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
              <Button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save API Key'}
              </Button>
            </>
          )}
          
          {step === 3 && (
            <>
              <div></div>
              <Button 
                type="button"
                onClick={() => {
                  onKeyAdded();
                  handleClose();
                }}
              >
                Done
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
